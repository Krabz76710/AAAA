import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { validateEmail } from '../utils/validation';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "votre@email.com",
  required = false
}) => {
  const [validation, setValidation] = useState<{ isValid: boolean; message?: string }>({ isValid: true });
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (value && isTouched) {
      const result = validateEmail(value);
      setValidation(result);
    } else if (!value && isTouched && required) {
      setValidation({ isValid: false, message: 'Email requis' });
    } else {
      setValidation({ isValid: true });
    }
  }, [value, isTouched, required]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (!isTouched) {
      setIsTouched(true);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const getValidationIcon = () => {
    if (!isTouched || !value) return null;
    
    if (validation.isValid) {
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getInputStyles = () => {
    let styles = `w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${className}`;
    
    if (!isTouched || !value) {
      styles += ' border-gray-300 focus:ring-indigo-500';
    } else if (validation.isValid) {
      styles += ' border-emerald-300 focus:ring-emerald-500 bg-emerald-50';
    } else {
      styles += ' border-red-300 focus:ring-red-500 bg-red-50';
    }
    
    return styles;
  };

  return (
    <div className="relative">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getInputStyles()}
          placeholder={placeholder}
          required={required}
          autoComplete="email"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>

      {/* Message de validation */}
      {isTouched && !validation.isValid && validation.message && (
        <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {validation.message}
        </div>
      )}

      {/* Message de succès */}
      {isTouched && validation.isValid && value && (
        <div className="mt-1 text-sm text-emerald-600 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Email valide
        </div>
      )}

      {/* Suggestions d'amélioration */}
      {isTouched && value && !validation.isValid && (
        <div className="mt-2 text-xs text-gray-500">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-medium text-gray-700 mb-1">Format attendu :</div>
            <div className="text-gray-600">nom@domaine.com</div>
            <div className="mt-1 text-gray-500">
              Exemples : jean.dupont@gmail.com, contact@entreprise.fr
            </div>
          </div>
        </div>
      )}
    </div>
  );
};