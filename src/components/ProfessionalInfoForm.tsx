import React from 'react';
import { Briefcase, GraduationCap, Award, Car, FileText, Calendar } from 'lucide-react';
import { IndividualProfile } from '../types';
import { AutocompleteInput } from './AutocompleteInput';
import { VehicleManager } from './VehicleManager';
import { getSuggestions } from '../data/professionalSuggestions';

interface ProfessionalInfoFormProps {
  data: Partial<IndividualProfile>;
  onChange: (data: Partial<IndividualProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({ 
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

  const isValid = data.status && data.profession;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Informations professionnelles</h2>
            <p className="text-gray-600">Décrivez votre activité et vos compétences</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut professionnel *</label>
                <select
                  value={data.status || ''}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un statut</option>
                  <option value="freelance">Freelance</option>
                  <option value="intermittent">Intermittent du spectacle</option>
                  <option value="auto_entrepreneur">Auto-entrepreneur</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Métier principal *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    list="profession-suggestions"
                    value={data.profession || ''}
                    onChange={(e) => handleChange('profession', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ex: Technicien son, Éclairagiste, Régisseur..."
                  />
                  <datalist id="profession-suggestions">
                    {getSuggestions('profession', data.profession || '', 10).map((suggestion, index) => (
                      <option key={index} value={suggestion} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">N° Sécurité Sociale</label>
                <input
                  type="text"
                  value={data.socialSecurityNumber || ''}
                  onChange={(e) => handleChange('socialSecurityNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="1 23 45 67 890 123 45"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Congés spectacles</label>
                <input
                  type="text"
                  value={data.entertainmentLeave || ''}
                  onChange={(e) => handleChange('entertainmentLeave', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ex: Numéro d'adhérent, organisme..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GUSO</label>
                <input
                  type="text"
                  value={data.guso || ''}
                  onChange={(e) => handleChange('guso', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ex: Numéro GUSO, informations..."
                />
              </div>
            </div>

            <div className="space-y-6">
              <AutocompleteInput
                value={data.specialty || []}
                onChange={(values) => handleChange('specialty', values)}
                suggestions={getSuggestions('specialty', '', 20)}
                placeholder="Ajouter une spécialité"
                icon={<Briefcase className="w-5 h-5" />}
                label="Spécialités"
              />

              <AutocompleteInput
                value={data.skills || []}
                onChange={(values) => handleChange('skills', values)}
                suggestions={getSuggestions('skills', '', 20)}
                placeholder="Ajouter une compétence"
                icon={<Award className="w-5 h-5" />}
                label="Compétences"
              />

              <AutocompleteInput
                value={data.formations || []}
                onChange={(values) => handleChange('formations', values)}
                suggestions={getSuggestions('formations', '', 20)}
                placeholder="Ajouter une formation"
                icon={<GraduationCap className="w-5 h-5" />}
                label="Formations"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AutocompleteInput
                  value={data.licenses || []}
                  onChange={(values) => handleChange('licenses', values)}
                  suggestions={getSuggestions('licenses', '', 15)}
                  placeholder="Ex: Permis B, Poids lourd..."
                  icon={<FileText className="w-5 h-5" />}
                  label="Permis"
                />

                <AutocompleteInput
                  value={data.caces || []}
                  onChange={(values) => handleChange('caces', values)}
                  suggestions={getSuggestions('caces', '', 15)}
                  placeholder="Ex: CACES R489..."
                  icon={<Award className="w-5 h-5" />}
                  label="CACES"
                />
              </div>

              <VehicleManager
                vehicles={data.vehicles || []}
                onChange={(vehicles) => handleChange('vehicles', vehicles)}
              />
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