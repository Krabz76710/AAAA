import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Location } from '../data/locations';
import { searchFrenchCities, searchByPostalCode } from '../services/locationService';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, location?: Location) => void;
  onLocationSelect?: (location: Location) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Rechercher une ville...",
  className = "",
  icon,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchCities = async () => {
      if (value.length >= 2) {
        setIsLoading(true);
        try {
          // Détecter si c'est un code postal (commence par des chiffres)
          const isPostalCode = /^\d/.test(value);
          
          let results: Location[];
          if (isPostalCode && value.length >= 4) {
            results = await searchByPostalCode(value);
          } else {
            results = await searchFrenchCities(value, 8);
          }
          
          setSuggestions(results);
          setIsOpen(results.length > 0);
        } catch (error) {
          console.error('Erreur de recherche:', error);
          setSuggestions([]);
          setIsOpen(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
        setIsLoading(false);
      }
      setHighlightedIndex(-1);
    };

    const timeoutId = setTimeout(searchCities, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [value]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSuggestionClick = (location: Location) => {
    const displayValue = `${location.name} (${location.postalCode})`;
    onChange(displayValue, location);
    onLocationSelect?.(location);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (value.length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${className}`}
          placeholder={placeholder}
          autoComplete="off"
          required={required}
        />
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
            <span className="text-sm text-gray-600">Recherche en cours...</span>
          </div>
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((location, index) => (
            <div
              key={`${location.name}-${location.postalCode}`}
              onClick={() => handleSuggestionClick(location)}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                index === highlightedIndex
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {location.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {location.postalCode} • {location.department} • {location.region}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && value.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mx-auto mb-2 text-gray-300" />
            Aucune ville trouvée pour "{value}"
          </div>
        </div>
      )}
    </div>
  );
};