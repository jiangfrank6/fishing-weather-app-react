const API_KEY = '4fad0bf609e51e4f8ce02b89b4f420e0';
const BASE_URL = 'https://api.openweathermap.org/geo/1.0';

export const searchLocations = async (searchTerm) => {
  if (!searchTerm) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/direct?q=${encodeURIComponent(searchTerm)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    
    const data = await response.json();
    return data.map(location => ({
      name: location.name,
      state: location.state,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
      displayName: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}; 