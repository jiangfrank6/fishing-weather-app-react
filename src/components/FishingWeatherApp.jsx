import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Waves, Thermometer, Eye, Droplets, Navigation, Fish, Moon } from 'lucide-react';
import { useWeatherAndTide } from '../hooks/useWeatherAndTide';
import SearchBar from './SearchBar';

const FishingWeatherApp = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'San Francisco',
    state: 'California',
    country: 'US',
    lat: 37.7749,
    lon: -122.4194,
    displayName: 'San Francisco, California, US'
  });
  const [darkMode, setDarkMode] = useState(false);
  const { data: weather, loading, error } = useWeatherAndTide(selectedLocation);

  const getWeatherIcon = (condition) => {
    condition = condition?.toLowerCase() || '';
    switch(condition) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'clouds': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-500" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getFishingConditions = (waves, wind, visibility) => {
    // If wave data is not available, only consider wind and visibility
    if (waves === 'N/A') {
      if (wind <= 10 && visibility >= 8) return { status: 'Good', color: 'text-green-500' };
      if (wind <= 15 && visibility >= 6) return { status: 'Fair', color: 'text-yellow-500' };
      return { status: 'Poor', color: 'text-red-500' };
    }

    // If all data is available, use the original logic
    if (waves <= 2 && wind <= 10 && visibility >= 8) return { status: 'Excellent', color: 'text-green-500' };
    if (waves <= 3.5 && wind <= 15 && visibility >= 6) return { status: 'Good', color: 'text-yellow-500' };
    if (waves <= 5 && wind <= 20 && visibility >= 4) return { status: 'Fair', color: 'text-orange-500' };
    return { status: 'Poor', color: 'text-red-500' };
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
      }`}>
        <div className="text-white text-xl">Error loading weather data: {error}</div>
      </div>
    );
  }

  if (loading || !weather) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
      }`}>
        <div className="text-white text-xl">Loading weather data...</div>
      </div>
    );
  }

  const fishingCondition = getFishingConditions(
    weather.current.waveHeight,
    weather.current.windSpeed,
    weather.current.visibility
  );

  const bgClass = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  
  const cardClass = darkMode 
    ? 'bg-gray-800/80 backdrop-blur-md border-gray-600/30' 
    : 'bg-white/20 backdrop-blur-md border-white/30';
  
  const subCardClass = darkMode 
    ? 'bg-gray-700/50' 
    : 'bg-white/10';
  
  const textPrimary = darkMode ? 'text-gray-100' : 'text-white';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-white/70';
  const textAccent = darkMode ? 'text-blue-300' : 'text-blue-100';

  return (
    <div className={`min-h-screen p-4 ${bgClass}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Fish className={`w-8 h-8 ${textPrimary}`} />
            <h1 className={`text-3xl font-bold ${textPrimary}`}>Fishing Weather</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`ml-4 p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Location Search */}
        <div className="mb-6">
          <SearchBar onLocationSelect={handleLocationSelect} darkMode={darkMode} />
        </div>

        {/* Current Conditions */}
        <div className={`rounded-xl p-6 mb-6 border ${cardClass}`}>
          <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>Current Conditions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Thermometer className={`w-6 h-6 ${textPrimary}`} />
                <div>
                  <p className={textSecondary}>Temperature</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{weather.current.temp}°F</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Wind className={`w-6 h-6 ${textPrimary}`} />
                <div>
                  <p className={textSecondary}>Wind</p>
                  <p className={`text-xl ${textPrimary}`}>{weather.current.windSpeed} mph {weather.current.windDirection}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Eye className={`w-6 h-6 ${textPrimary}`} />
                <div>
                  <p className={textSecondary}>Visibility</p>
                  <p className={`text-xl ${textPrimary}`}>{weather.current.visibility} miles</p>
                </div>
              </div>
            </div>

            {/* Wave Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Waves className={`w-6 h-6 ${textPrimary}`} />
                <div>
                  <p className={textSecondary}>Wave Height</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>{weather.current.waveHeight} ft</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Navigation className={`w-6 h-6 ${textPrimary}`} />
                <div>
                  <p className={textSecondary}>Wave Direction</p>
                  <p className={`text-xl ${textPrimary}`}>{weather.current.waveDirection}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Droplets className={`w-6 h-6 ${textPrimary}`} />
                <div>
                  <p className={textSecondary}>Tide</p>
                  <p className={`text-xl ${textPrimary}`}>{weather.current.tideStatus}</p>
                  <p className={`text-sm ${textSecondary}`}>{weather.current.nextTide}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fishing Conditions */}
          <div className={`mt-6 p-4 rounded-lg ${subCardClass}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-semibold ${textPrimary}`}>Fishing Conditions</h3>
              <span className={`text-xl font-bold ${fishingCondition.color}`}>
                {fishingCondition.status}
              </span>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className={`rounded-xl p-6 border ${cardClass}`}>
          <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>Today's Forecast</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weather.forecast.map((item, index) => (
              <div key={index} className={`rounded-lg p-4 text-center ${subCardClass}`}>
                <p className={`text-sm mb-2 ${textSecondary}`}>{item.time}</p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(item.condition)}
                </div>
                <p className={`font-semibold ${textPrimary}`}>{item.temp}°F</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Waves className={`w-4 h-4 ${textAccent}`} />
                    <span className={`text-sm ${textPrimary}`}>{item.waves} ft</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Wind className={`w-4 h-4 ${textAccent}`} />
                    <span className={`text-sm ${textPrimary}`}>{item.wind} mph</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className={`mt-6 rounded-xl p-6 border ${cardClass}`}>
          <h3 className={`text-xl font-bold mb-3 ${textPrimary}`}>Fishing Tips</h3>
          <div className={`space-y-2 ${textSecondary}`}>
            <p>• Best fishing typically occurs during rising tides</p>
            <p>• Wave heights under 3 feet are ideal for most fishing</p>
            <p>• Wind speeds below 15 mph provide comfortable conditions</p>
            <p>• Higher visibility improves spotting fish and navigation safety</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FishingWeatherApp; 