import { useState, useEffect } from 'react';
import { getWeatherData } from '../services/weatherService';
import { getTideData, getWaveData } from '../services/tideService';

// NOAA station mapping - you can extend this list
const NOAA_STATIONS = {
  'San Francisco': '9414290',
  'Monterey': '9413450',
  // Add more mappings as needed
};

export const useWeatherAndTide = (location) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!location || !location.lat || !location.lon) {
          throw new Error('Invalid location');
        }

        // Fetch weather data (required)
        const weatherData = await getWeatherData(location.lat, location.lon);
        
        // Try to find nearest NOAA station (optional)
        const nearestStation = NOAA_STATIONS[location.name] || null;
        
        // Fetch tide and wave data if station is available (optional)
        let tideData = [];
        let waveData = [];
        if (nearestStation) {
          try {
            tideData = await getTideData(nearestStation);
            waveData = await getWaveData(nearestStation);
          } catch (e) {
            console.warn('Failed to fetch tide/wave data:', e);
            // Continue without tide/wave data
          }
        }

        // Process and combine the data
        const current = {
          ...weatherData.current,
          waveHeight: getLatestWaveHeight(waveData),
          waveDirection: 'N/A', // NOAA doesn't provide wave direction in free tier
          wavePeriod: 'N/A',
          ...processTideData(tideData)
        };

        // Process forecast data
        const forecast = weatherData.hourly.slice(0, 8).map((hour, index) => ({
          time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
          temp: Math.round(hour.temp),
          waves: getWaveHeight(waveData, index),
          wind: Math.round(hour.wind_speed),
          condition: hour.weather[0].main.toLowerCase()
        }));

        setData({ current, forecast });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  return { data, loading, error };
};

// Helper functions
const getLatestWaveHeight = (waveData) => {
  if (!waveData || waveData.length === 0) return 'N/A';
  return parseFloat(waveData[0].v);
};

const getWaveHeight = (waveData, index) => {
  if (!waveData || !waveData[index]) return 'N/A';
  return parseFloat(waveData[index].v);
};

const processTideData = (tideData) => {
  if (!tideData || tideData.length === 0) {
    return {
      tideStatus: 'N/A',
      nextTide: 'N/A'
    };
  }

  const now = new Date();
  const currentTide = tideData.find(tide => new Date(tide.t) > now);
  const previousTide = tideData.find(tide => new Date(tide.t) < now);

  if (!currentTide || !previousTide) {
    return {
      tideStatus: 'N/A',
      nextTide: 'N/A'
    };
  }

  const rising = parseFloat(currentTide.v) > parseFloat(previousTide.v);
  const nextTideTime = new Date(currentTide.t).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  });

  return {
    tideStatus: rising ? 'Rising' : 'Falling',
    nextTide: `${rising ? 'High' : 'Low'} at ${nextTideTime}`
  };
}; 