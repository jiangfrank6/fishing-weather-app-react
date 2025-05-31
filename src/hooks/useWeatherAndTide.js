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
        const forecast = weatherData.hourly.map((hour, index) => {
          const date = new Date(hour.dt * 1000); // Convert Unix timestamp to Date
          const now = new Date();
          const isToday = date.getDate() === now.getDate() && 
                         date.getMonth() === now.getMonth() &&
                         date.getFullYear() === now.getFullYear();
          
          const timeString = date.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true 
          });

          const dateString = date.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric'
          });

          const dayString = date.toLocaleDateString('en-US', {
            weekday: 'short'
          });
          
          return {
            time: isToday 
              ? `Today, ${dateString}, ${timeString}`
              : `${dayString}, ${dateString}, ${timeString}`,
            temp: Math.round(hour.temp),
            waves: hour.waves,
            wind: Math.round(hour.wind_speed),
            condition: hour.weather[0].main.toLowerCase(),
            // Add tide height if available
            tideHeight: tideData.heights[index]?.height || null
          };
        });

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