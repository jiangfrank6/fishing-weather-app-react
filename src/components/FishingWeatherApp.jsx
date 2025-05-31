import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Waves, Thermometer, Eye, Droplets, Navigation, Fish } from 'lucide-react';
import { useWeatherAndTide } from '../hooks/useWeatherAndTide';
import SearchBar from './SearchBar';
import TideChart from './TideChart';

const FishingWeatherApp = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'San Francisco',
    state: 'California',
    country: 'US',
    lat: 37.7749,
    lon: -122.4194,
    displayName: 'San Francisco, California, US'
  });
  const { data: weather, loading, error } = useWeatherAndTide(selectedLocation);

  const getWeatherIcon = (condition) => {
    condition = condition?.toLowerCase() || '';
    switch(condition) {
      case 'clear': return <Sun className="w-8 h-8 text-amber-400" />;
      case 'clouds': return <Cloud className="w-8 h-8 text-slate-300" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-sky-400" />;
      default: return <Sun className="w-8 h-8 text-amber-400" />;
    }
  };

  const getFishingConditions = (waves, wind, visibility) => {
    // If wave data is not available, only consider wind and visibility
    if (waves === 'N/A') {
      if (wind <= 10 && visibility >= 8) return { status: 'Good', color: 'text-emerald-400' };
      if (wind <= 15 && visibility >= 6) return { status: 'Fair', color: 'text-amber-400' };
      return { status: 'Poor', color: 'text-rose-400' };
    }

    // If all data is available, use the original logic
    if (waves <= 2 && wind <= 10 && visibility >= 8) return { status: 'Excellent', color: 'text-emerald-400' };
    if (waves <= 3.5 && wind <= 15 && visibility >= 6) return { status: 'Good', color: 'text-teal-400' };
    if (waves <= 5 && wind <= 20 && visibility >= 4) return { status: 'Fair', color: 'text-amber-400' };
    return { status: 'Poor', color: 'text-rose-400' };
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-slate-100 text-xl">Error loading weather data: {error}</div>
      </div>
    );
  }

  if (loading || !weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-slate-100 text-xl">Loading weather data...</div>
      </div>
    );
  }

  const fishingCondition = getFishingConditions(
    weather.current.waveHeight,
    weather.current.windSpeed,
    weather.current.visibility
  );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Fish className="w-8 h-8 text-slate-100" />
            <h1 className="text-3xl font-bold text-slate-100">Fishing Weather</h1>
          </div>
        </div>

        {/* Location Search */}
        <div className="mb-6">
          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>

        {/* Current Conditions */}
        <div className="rounded-xl p-6 mb-6 border bg-slate-800/90 backdrop-blur-md border-slate-700/40">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-100">Current Conditions</h2>
            <span className="text-lg text-slate-300">{selectedLocation.displayName}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Thermometer className="w-6 h-6 text-slate-100" />
                <div>
                  <p className="text-slate-300">Temperature</p>
                  <p className="text-2xl font-bold text-slate-100">{weather.current.temp}°F</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Wind className="w-6 h-6 text-slate-100" />
                <div>
                  <p className="text-slate-300">Wind</p>
                  <p className="text-xl text-slate-100">{weather.current.windSpeed} mph {weather.current.windDirection}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Eye className="w-6 h-6 text-slate-100" />
                <div>
                  <p className="text-slate-300">Visibility</p>
                  <p className="text-xl text-slate-100">{weather.current.visibility} miles</p>
                </div>
              </div>
            </div>

            {/* Wave Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Waves className="w-6 h-6 text-slate-100" />
                <div>
                  <p className="text-slate-300">Wave Height</p>
                  <p className="text-2xl font-bold text-slate-100">{weather.current.waveHeight} ft</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Navigation className="w-6 h-6 text-slate-100" />
                <div>
                  <p className="text-slate-300">Wave Direction</p>
                  <p className="text-xl text-slate-100">{weather.current.waveDirection}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Droplets className="w-6 h-6 text-slate-100" />
                <div>
                  <p className="text-slate-300">Tide</p>
                  <p className="text-xl text-slate-100">{weather.current.tideStatus}</p>
                  <p className="text-sm text-slate-300">{weather.current.nextTide}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tide Chart - Now outside the grid */}
          <div className="mt-8">
            <p className="text-sm mb-2 text-slate-300">Today's Tide Heights</p>
            <div className="px-2">
              <TideChart tideData={weather.heights} />
            </div>
          </div>

          {/* Fishing Conditions */}
          <div className="mt-6 p-4 rounded-lg bg-slate-700/70">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-100">Fishing Conditions</h3>
              <span className={`text-xl font-bold ${fishingCondition.color}`}>
                {fishingCondition.status}
              </span>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="rounded-xl p-6 border bg-slate-800/90 backdrop-blur-md border-slate-700/40">
          <h2 className="text-2xl font-bold mb-4 text-slate-100">Today's Forecast</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weather.forecast.map((item, index) => (
              <div 
                key={index} 
                className="rounded-lg p-4 text-center bg-slate-700/70 hover:bg-slate-700/90 transition-colors border border-slate-600/30"
              >
                <p className="text-sm font-medium mb-2 text-slate-300">{item.time}</p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(item.condition)}
                </div>
                <p className="text-lg font-bold text-slate-100">{item.temp}°F</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Waves className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-medium text-slate-100">{item.waves} ft</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Wind className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-medium text-slate-100">{item.wind} mph</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 rounded-xl p-6 border bg-slate-800/90 backdrop-blur-md border-slate-700/40">
          <h3 className="text-xl font-bold mb-3 text-slate-100">Fishing Tips</h3>
          <div className="space-y-2 text-slate-300">
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