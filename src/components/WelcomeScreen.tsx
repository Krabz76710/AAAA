import React, { useState } from 'react';
import { User, Building, ArrowRight, Sparkles, Shield, FileText } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (userType: 'individual' | 'company') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [selectedType, setSelectedType] = useState<'individual' | 'company' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStart = () => {
    if (!selectedType) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      onStart(selectedType);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className={`max-w-4xl w-full transition-all duration-500 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TalentHub</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La plateforme qui connecte les talents du spectacle et de l'événementiel avec les professionnels du secteur
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div 
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedType === 'individual' 
                ? 'transform scale-105' 
                : 'hover:transform hover:scale-102'
            }`}
            onClick={() => setSelectedType('individual')}
          >
            <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
              selectedType === 'individual' 
                ? 'border-indigo-500 ring-4 ring-indigo-100' 
                : 'border-gray-200 hover:border-indigo-300 hover:shadow-xl'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  selectedType === 'individual' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white'
                }`}>
                  <User className="w-8 h-8" />
                </div>
                {selectedType === 'individual' && (
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Personne physique</h3>
              <p className="text-gray-600 mb-4">
                Freelances, intermittents, auto-entrepreneurs, consultants indépendants
              </p>
              
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Profil professionnel complet
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Coffre-fort numérique personnel
                </li>
                <li className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Gestion des compétences et certifications
                </li>
              </ul>
            </div>
          </div>

          <div 
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedType === 'company' 
                ? 'transform scale-105' 
                : 'hover:transform hover:scale-102'
            }`}
            onClick={() => setSelectedType('company')}
          >
            <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
              selectedType === 'company' 
                ? 'border-purple-500 ring-4 ring-purple-100' 
                : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  selectedType === 'company' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white'
                }`}>
                  <Building className="w-8 h-8" />
                </div>
                {selectedType === 'company' && (
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Personne morale</h3>
              <p className="text-gray-600 mb-4">
                Entreprises du spectacle, production, location de matériel, structures événementielles
              </p>
              
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-500" />
                  Gestion multi-utilisateurs
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Documents légaux centralisés
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Traçabilité et journal d'activité
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={!selectedType || isAnimating}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              selectedType 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Commencer l'inscription
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};