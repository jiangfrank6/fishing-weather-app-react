const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '4fad0bf609e51e4f8ce02b89b4f420e0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (lat, lon, selectedDate) => {
  try {
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    
    // Get current weather only if selected date is today
    let currentData;
    if (isToday) {
      const currentResponse = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current weather data');
      }
      
      currentData = await currentResponse.json();
    }

    // Get 5-day forecast with 3-hour intervals (maximum available in free tier)
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const forecastData = await forecastResponse.json();

    // Calculate wave height based on wind speed
    const calculateWaveHeight = (windSpeed) => {
      if (windSpeed < 7) return 0.5;
      if (windSpeed < 11) return 1;
      if (windSpeed < 16) return 2;
      if (windSpeed < 21) return 3;
      if (windSpeed < 27) return 4;
      if (windSpeed < 33) return 5.5;
      if (windSpeed < 40) return 7;
      return 9;
    };

    // Filter forecast data for the selected date
    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    const selectedDateEnd = new Date(selectedDate);
    selectedDateEnd.setHours(23, 59, 59, 999);

    const filteredHourly = forecastData.list.filter(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate >= selectedDateStart && itemDate <= selectedDateEnd;
    });

    // If no forecast data is available for the selected date, return null
    if (filteredHourly.length === 0) {
      throw new Error('No forecast data available for the selected date');
    }

    // For future dates, use the first forecast of the day as "current" conditions
    const current = isToday ? {
      temp: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      windSpeed: Math.round(currentData.wind.speed),
      windDirection: getWindDirection(currentData.wind.deg),
      humidity: currentData.main.humidity,
      visibility: Math.round(currentData.visibility / 1609.34), // Convert meters to miles
      pressure: (currentData.main.pressure * 0.02953).toFixed(2), // Convert hPa to inHg
      waveHeight: calculateWaveHeight(currentData.wind.speed)
    } : {
      temp: Math.round(filteredHourly[0].main.temp),
      condition: filteredHourly[0].weather[0].main,
      windSpeed: Math.round(filteredHourly[0].wind.speed),
      windDirection: getWindDirection(filteredHourly[0].wind.deg),
      humidity: filteredHourly[0].main.humidity,
      visibility: Math.round((filteredHourly[0].visibility || 10000) / 1609.34),
      pressure: (filteredHourly[0].main.pressure * 0.02953).toFixed(2),
      waveHeight: calculateWaveHeight(filteredHourly[0].wind.speed)
    };

    return {
      current,
      hourly: filteredHourly.map(item => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        weather: item.weather,
        wind_speed: Math.round(item.wind.speed),
        waves: calculateWaveHeight(item.wind.speed).toFixed(1)
      }))
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Helper function to convert wind degrees to direction
const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
  return directions[index];
};

// Location coordinates for our supported areas
export const LOCATIONS = {
  'San Francisco Bay': {
    lat: 37.7749,
    lon: -122.4194,
    noaaStationId: '9414290' // San Francisco NOAA station
  },
  'Monterey Bay': {
    lat: 36.8007,
    lon: -121.9473,
    noaaStationId: '9413450' // Monterey NOAA station
  }
}; 