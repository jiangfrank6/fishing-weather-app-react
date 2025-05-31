import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Waves, Thermometer, Eye, Droplets, Navigation, Fish, Moon } from 'lucide-react';

const FishingWeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('San Francisco Bay');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  // Simulated weather and wave data (in a real app, this would come from APIs like OpenWeather, NOAA, etc.)
  const mockWeatherData = {
    'San Francisco Bay': {
      current: {
        temp: 68,
        condition: 'Partly Cloudy',
        windSpeed: 12,
        windDirection: 'NW',
        humidity: 72,
        visibility: 8,
        pressure: 30.15,
        waveHeight: 2.5,
        waveDirection: 'W',
        wavePeriod: 8,
        tideStatus: 'Rising',
        nextTide: 'High at 3:24 PM'
      },
      forecast: [
        { time: '12 PM', temp: 66, waves: 2.3, wind: 10, condition: 'sunny' },
        { time: '3 PM', temp: 70, waves: 2.8, wind: 14, condition: 'partly-cloudy' },
        { time: '6 PM', temp: 68, waves: 3.1, wind: 16, condition: 'cloudy' },
        { time: '9 PM', temp: 64, waves: 2.9, wind: 12, condition: 'partly-cloudy' }
      ]
    },
    'Monterey Bay': {
      current: {
        temp: 62,
        condition: 'Overcast',
        windSpeed: 8,
        windDirection: 'SW',
        humidity: 85,
        visibility: 6,
        pressure: 29.98,
        waveHeight: 4.2,
        waveDirection: 'SW',
        wavePeriod: 12,
        tideStatus: 'Falling',
        nextTide: 'Low at 5:45 PM'
      },
      forecast: [
        { time: '12 PM', temp: 60, waves: 4.0, wind: 6, condition: 'cloudy' },
        { time: '3 PM', temp: 64, waves: 4.5, wind: 10, condition: 'cloudy' },
        { time: '6 PM', temp: 62, waves: 4.8, wind: 12, condition: 'rainy' },
        { time: '9 PM', temp: 58, waves: 4.2, wind: 8, condition: 'cloudy' }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWeather(mockWeatherData[location]);
      setLoading(false);
    }, 1000);

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [location]);

  const getWeatherIcon = (condition) => {
    switch(condition) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'partly-cloudy': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-600" />;
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-500" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getFishingConditions = (waves, wind, visibility) => {
    if (waves <= 2 && wind <= 10 && visibility >= 8) return { status: 'Excellent', color: 'text-green-500' };
    if (waves <= 3.5 && wind <= 15 && visibility >= 6) return { status: 'Good', color: 'text-yellow-500' };
    if (waves <= 5 && wind <= 20 && visibility >= 4) return { status: 'Fair', color: 'text-orange-500' };
    return { status: 'Poor', color: 'text-red-500' };
  };

  if (loading) {
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

  const fishingCondition = getFishingConditions(weather.current.waveHeight, weather.current.windSpeed, weather.current.visibility);

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
          <p className={textAccent}>{currentTime.toLocaleString()}</p>
        </div>

        {/* Location Selector */}
        <div className="mb-6">
          <select 
            value={location} 
            onChange={(e) => {
              setLocation(e.target.value);
              setLoading(true);
            }}
            className={`w-full p-3 rounded-lg backdrop-blur-sm border ${
              darkMode 
                ? 'bg-gray-800/80 text-gray-100 placeholder-gray-400 border-gray-600/30' 
                : 'bg-white/20 text-white placeholder-white/70 border-white/30'
            }`}
          >
            <option value="San Francisco Bay">San Francisco Bay</option>
            <option value="Monterey Bay">Monterey Bay</option>
          </select>
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