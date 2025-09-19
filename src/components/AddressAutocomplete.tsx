import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Building, Hash } from 'lucide-react';
import { Address, DetailedAddress, searchFrenchAddresses } from '../services/addressService';

interface AddressAutocompleteProps {
  value: DetailedAddress;
  onChange: (address: DetailedAddress) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Rechercher une adresse...",
  className = "",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialiser la requête de recherche avec l'adresse actuelle
  useEffect(() => {
    if (value.street && !searchQuery) {
      setSearchQuery(value.street);
    }
  }, [value.street]);

  useEffect(() => {
    const searchAddresses = async () => {
      if (searchQuery.length >= 3) {
        setIsLoading(true);
        try {
          const results = await searchFrenchAddresses(searchQuery, 8);
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

    const timeoutId = setTimeout(searchAddresses, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
    setSearchQuery(newValue);
    
    // Mettre à jour l'adresse avec la saisie manuelle
    onChange({
      ...value,
      street: newValue
    });
  };

  const handleAddressSelect = (address: Address) => {
    setSearchQuery(address.label);
    onChange({
      ...value,
      street: address.street,
      city: address.city,
      postalCode: address.postcode,
      country: 'FR'
    });
    setIsOpen(false);
    setHighlightedIndex(-1);
    setShowDetails(true);
  };

  const handleDetailChange = (field: keyof DetailedAddress, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue
    });
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
          handleAddressSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (searchQuery.length >= 3 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'housenumber': return '🏠';
      case 'street': return '🛣️';
      case 'locality': return '📍';
      default: return '🏘️';
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'housenumber': return 'Numéro';
      case 'street': return 'Rue';
      case 'locality': return 'Lieu-dit';
      case 'municipality': return 'Commune';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Champ principal d'adresse */}
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className={`w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${className}`}
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
              <span className="text-sm text-gray-600">Recherche d'adresses...</span>
            </div>
          </div>
        )}

        {isOpen && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          >
            {suggestions.map((address, index) => (
              <div
                key={address.id}
                onClick={() => handleAddressSelect(address)}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  index === highlightedIndex
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{getAddressTypeIcon(address.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {address.label}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      <span className="inline-flex items-center gap-1">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {getAddressTypeLabel(address.type)}
                        </span>
                        {address.context}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && searchQuery.length >= 3 && suggestions.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <div className="text-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mx-auto mb-2 text-gray-300" />
              Aucune adresse trouvée pour "{searchQuery}"
            </div>
          </div>
        )}
      </div>

      {/* Champs de détails supplémentaires */}
      {(showDetails || value.building || value.floor || value.apartment) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="md:col-span-3 mb-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Building className="w-4 h-4" />
              Informations complémentaires
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bâtiment</label>
            <input
              type="text"
              value={value.building || ''}
              onChange={(e) => handleDetailChange('building', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="Ex: Bât. A, Tour Est..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Étage</label>
            <input
              type="text"
              value={value.floor || ''}
              onChange={(e) => handleDetailChange('floor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="Ex: 3ème, RDC..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Appartement</label>
            <div className="relative">
              <Hash className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={value.apartment || ''}
                onChange={(e) => handleDetailChange('apartment', e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: 12, A, 3B..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Bouton pour afficher les détails */}
      {!showDetails && value.street && (
        <button
          type="button"
          onClick={() => setShowDetails(true)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
        >
          <Building className="w-4 h-4" />
          Ajouter bâtiment, étage, appartement...
        </button>
      )}
    </div>
  );
};