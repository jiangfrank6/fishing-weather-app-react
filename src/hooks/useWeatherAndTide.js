import { useState, useEffect } from 'react';
import { getWeatherData } from '../services/weatherService';
import { getTideData } from '../services/tideService';

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

        // Fetch both weather and tide data in parallel
        const [weatherData, tideData] = await Promise.all([
          getWeatherData(location.lat, location.lon),
          getTideData(location.lat, location.lon)
        ]);
        
        // Process and combine the data
        const current = {
          ...weatherData.current,
          tideHeight: tideData.currentHeight,
          tideStatus: tideData.tideStatus,
          nextTide: tideData.nextTide
        };

        // Process forecast data
        const forecast = weatherData.hourly.slice(0, 8).map((hour, index) => ({
          time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
          temp: Math.round(hour.temp),
          waves: hour.waves,
          wind: Math.round(hour.wind_speed),
          condition: hour.weather[0].main.toLowerCase(),
          // Add tide height if available
          tideHeight: tideData.heights[index]?.height || null
        }));

        setData({ 
          current, 
          forecast,
          heights: tideData.heights,
          tideCopyright: tideData.copyright // Required by WorldTides terms of service
        });
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