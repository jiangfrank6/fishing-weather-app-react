import { useState, useEffect } from 'react';
import { getWeatherData, LOCATIONS } from '../services/weatherService';
import { getTideData, getWaveData } from '../services/tideService';

export const useWeatherAndTide = (location) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const locationData = LOCATIONS[location];
        if (!locationData) {
          throw new Error('Location not supported');
        }

        // Fetch weather data (required)
        const weatherData = await getWeatherData(locationData.lat, locationData.lon);
        
        // Fetch tide and wave data (optional)
        let tideData = [];
        let waveData = [];
        try {
          tideData = await getTideData(locationData.noaaStationId);
          waveData = await getWaveData(locationData.noaaStationId);
        } catch (e) {
          console.warn('Failed to fetch tide/wave data:', e);
          // Continue without tide/wave data
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
        const forecast = weatherData.hourly.map((hour, index) => ({
          time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
          temp: hour.temp,
          waves: getWaveHeight(waveData, index),
          wind: hour.wind_speed,
          condition: hour.weather.main.toLowerCase()
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