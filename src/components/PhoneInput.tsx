import React, { useState, useRef, useEffect } from 'react';
import { Phone, ChevronDown } from 'lucide-react';
import { countries, Country, getCountryByDialCode } from '../data/countries';
import { formatPhoneNumber, validatePhoneNumber } from '../utils/validation';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "Numéro de téléphone",
  required = false
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // France par défaut
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validation, setValidation] = useState<{ isValid: boolean; message?: string }>({ isValid: true });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialiser le numéro de téléphone depuis la valeur
  useEffect(() => {
    if (value) {
      // Extraire le code pays et le numéro
      const country = countries.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.replace(country.dialCode, '').trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPhoneNumber(inputValue);
    
    // Formater et valider le numéro
    const fullNumber = selectedCountry.dialCode + ' ' + inputValue;
    const validation = validatePhoneNumber(inputValue, selectedCountry.dialCode);
    setValidation(validation);
    
    // Mettre à jour la valeur parent
    onChange(fullNumber);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    
    // Revalider avec le nouveau pays
    const fullNumber = country.dialCode + ' ' + phoneNumber;
    const validation = validatePhoneNumber(phoneNumber, country.dialCode);
    setValidation(validation);
    
    onChange(fullNumber);
  };

  const formatDisplayNumber = (number: string) => {
    return formatPhoneNumber(number, selectedCountry.dialCode);
  };

  return (
    <div className="relative">
      <div className="flex">
        {/* Sélecteur de pays */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-64">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                    selectedCountry.code === country.code ? 'bg-indigo-50 text-indigo-700' : ''
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{country.name}</div>
                    <div className="text-sm text-gray-500">{country.dialCode}</div>
                  </div>
                  {country.format && (
                    <div className="text-xs text-gray-400">{country.format}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Champ de saisie du numéro */}
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
              !validation.isValid ? 'border-red-300 focus:ring-red-500' : ''
            } ${className}`}
            placeholder={placeholder}
            required={required}
          />
        </div>
      </div>

      {/* Message de validation */}
      {!validation.isValid && validation.message && (
        <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {validation.message}
        </div>
      )}

      {/* Aide au format */}
      {selectedCountry.format && validation.isValid && phoneNumber && (
        <div className="mt-1 text-xs text-gray-500">
          Format attendu : {selectedCountry.format}
        </div>
      )}
    </div>
  );
};