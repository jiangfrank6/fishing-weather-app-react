const API_KEY = '4fad0bf609e51e4f8ce02b89b4f420e0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (lat, lon) => {
  try {
    // Get current weather
    const currentResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );
    
    if (!currentResponse.ok) {
      throw new Error('Failed to fetch current weather data');
    }
    
    const currentData = await currentResponse.json();

    // Get hourly forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}&cnt=40`
    );

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const forecastData = await forecastResponse.json();

    // Get marine data
    const marineResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );

    if (!marineResponse.ok) {
      throw new Error('Failed to fetch marine data');
    }

    const marineData = await marineResponse.json();

    // Calculate wave height from wind speed using Beaufort scale approximation
    const windSpeed = currentData.wind.speed;
    let approximateWaveHeight;
    
    if (windSpeed < 7) approximateWaveHeight = 0.5;
    else if (windSpeed < 11) approximateWaveHeight = 1;
    else if (windSpeed < 16) approximateWaveHeight = 2;
    else if (windSpeed < 21) approximateWaveHeight = 3;
    else if (windSpeed < 27) approximateWaveHeight = 4;
    else if (windSpeed < 33) approximateWaveHeight = 5.5;
    else if (windSpeed < 40) approximateWaveHeight = 7;
    else approximateWaveHeight = 9;

    return {
      current: {
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        windSpeed: Math.round(currentData.wind.speed),
        windDirection: getWindDirection(currentData.wind.deg),
        humidity: currentData.main.humidity,
        visibility: Math.round(currentData.visibility / 1609.34), // Convert meters to miles
        pressure: (currentData.main.pressure * 0.02953).toFixed(2), // Convert hPa to inHg
        waveHeight: approximateWaveHeight.toFixed(1),
        waveDirection: getWindDirection(currentData.wind.deg), // Waves typically follow wind direction
        wavePeriod: calculateWavePeriod(windSpeed)
      },
      hourly: forecastData.list.map(item => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        weather: [{main: item.weather[0].main}],
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
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

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

const calculateWavePeriod = (windSpeed) => {
  // Approximate wave period based on wind speed
  // Using simplified relationship between wind speed and wave period
  const period = Math.round(3.5 + (windSpeed / 5));
  return Math.min(Math.max(period, 4), 12); // Keep period between 4 and 12 seconds
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