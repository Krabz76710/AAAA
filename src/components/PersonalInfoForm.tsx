import React from 'react';
import { User, MapPin, Calendar } from 'lucide-react';
import { IndividualProfile } from '../types';
import { LocationAutocomplete } from './LocationAutocomplete';
import { AddressAutocomplete } from './AddressAutocomplete';
import { EmailInput } from './EmailInput';
import { PhoneInput } from './PhoneInput';
import { Location } from '../data/locations';

interface PersonalInfoFormProps {
  data: Partial<IndividualProfile>;
  onChange: (data: Partial<IndividualProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onPrev 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (field: keyof IndividualProfile, value: any) => {
    onChange({ [field]: value });
  };

  const handleLocationSelect = (field: 'birthPlace' | 'address', location: Location) => {
    if (field === 'birthPlace') {
      handleChange('birthPlace', location.name);
    } else if (field === 'address') {
      handleChange('address', {
        ...data.address,
        city: location.name,
        postalCode: location.postalCode,
        country: 'FR'
      });
    }
  };

  const isValid = data.firstName && data.lastName && data.email && data.phone;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Informations personnelles</h2>
            <p className="text-gray-600">Commençons par vos informations de base</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Civilité</label>
                <select
                  value={data.title || ''}
                  onChange={(e) => handleChange('title', e.target.value as 'mr' | 'mrs' | 'other')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Sélectionner</option>
                  <option value="mr">M.</option>
                  <option value="mrs">Mme</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  value={data.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Votre prénom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={data.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Votre nom"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <EmailInput
                  value={data.email || ''}
                  onChange={(value) => handleChange('email', value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <PhoneInput
                  value={data.phone || ''}
                  onChange={(value) => handleChange('phone', value)}
                  placeholder="Numéro de téléphone"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={data.birthDate || ''}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance</label>
                <LocationAutocomplete
                  value={data.birthPlace || ''}
                  onChange={(value) => handleChange('birthPlace', value)}
                  onLocationSelect={(location) => handleLocationSelect('birthPlace', location)}
                  placeholder="Rechercher votre ville de naissance..."
                  icon={<MapPin className="w-5 h-5" />}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <AddressAutocomplete
                value={data.address || { street: '', city: '', postalCode: '', country: 'FR' }}
                onChange={(address) => handleChange('address', address)}
                placeholder="Rechercher votre adresse complète..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <LocationAutocomplete
                  value={data.address?.city || ''}
                  onChange={(value) => handleChange('address', { ...data.address, city: value })}
                  onLocationSelect={(location) => handleLocationSelect('address', location)}
                  placeholder="Rechercher votre ville..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                <input
                  type="text"
                  value={data.address?.postalCode || ''}
                  onChange={(e) => handleChange('address', { ...data.address, postalCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="75000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <select
                  value={data.address?.country || ''}
                  onChange={(e) => handleChange('address', { ...data.address, country: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Sélectionner</option>
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="CH">Suisse</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onPrev}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Précédent
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  isValid 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continuer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};