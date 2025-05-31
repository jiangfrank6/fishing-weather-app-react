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
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const forecastData = await forecastResponse.json();

    return {
      current: {
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        windSpeed: Math.round(currentData.wind.speed),
        windDirection: getWindDirection(currentData.wind.deg),
        humidity: currentData.main.humidity,
        visibility: Math.round(currentData.visibility / 1609.34), // Convert meters to miles
        pressure: (currentData.main.pressure * 0.02953).toFixed(2) // Convert hPa to inHg
      },
      hourly: forecastData.list.slice(0, 8).map(item => ({
        dt: item.dt,
        temp: Math.round(item.main.temp),
        weather: [{main: item.weather[0].main}],
        wind_speed: Math.round(item.wind.speed)
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