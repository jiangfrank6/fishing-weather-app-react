import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchLocations } from '../services/locationService';

const SearchBar = ({ onLocationSelect, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsLoading(true);
        const locations = await searchLocations(searchTerm);
        setSuggestions(locations);
        setShowSuggestions(true);
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelectLocation = (location) => {
    setSearchTerm(location.displayName);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for a location..."
          className={`w-full p-3 pr-10 rounded-lg backdrop-blur-sm border ${
            darkMode
              ? 'bg-gray-800/80 text-gray-100 placeholder-gray-400 border-gray-600/30'
              : 'bg-white/20 text-white placeholder-white/70 border-white/30'
          }`}
        />
        <Search
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            darkMode ? 'text-gray-400' : 'text-white/70'
          }`}
        />
      </div>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div
          className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}
        >
          {isLoading ? (
            <div className={`p-3 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Searching...
            </div>
          ) : (
            <ul>
              {suggestions.map((location, index) => (
                <li
                  key={`${location.lat}-${location.lon}-${index}`}
                  onClick={() => handleSelectLocation(location)}
                  className={`p-3 cursor-pointer ${
                    darkMode
                      ? 'text-gray-100 hover:bg-gray-700'
                      : 'text-gray-800 hover:bg-gray-100'
                  } ${index !== suggestions.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  {location.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 