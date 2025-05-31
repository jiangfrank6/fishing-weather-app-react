import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchLocations } from '../services/locationService';

const SearchBar = ({ onLocationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
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
    }, 300); // Reduced from 500ms to 300ms for faster response

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectLocation(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSelectLocation = (location) => {
    setSearchTerm(location.displayName);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onLocationSelect(location);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a location..."
          className="w-full p-3 pr-10 rounded-lg backdrop-blur-sm border bg-slate-800/80 text-slate-100 placeholder-slate-400 border-slate-700/30 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-lg transition-all duration-300"
        />
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        />
      </div>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div
          className="absolute z-10 w-full mt-1 rounded-lg shadow-xl bg-slate-800 border-slate-700 border backdrop-blur-md overflow-hidden"
        >
          {isLoading ? (
            <div className="p-3 text-center text-slate-300">
              Searching...
            </div>
          ) : (
            <ul className="max-h-60 overflow-auto">
              {suggestions.map((location, index) => (
                <li
                  key={`${location.lat}-${location.lon}-${index}`}
                  onClick={() => handleSelectLocation(location)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 cursor-pointer transition-all duration-200 ${
                    index === selectedIndex
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-100 hover:bg-slate-700'
                  } ${index !== suggestions.length - 1 ? 'border-b border-slate-700/50' : ''}`}
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