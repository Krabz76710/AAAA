import React, { useState } from 'react';
import { Building, Upload, Plus, X, User, Search, AlertCircle, CheckCircle, MapPin, Calendar, Users, Award, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { CompanyProfile, SubUser } from '../types';
import { LocationAutocomplete } from './LocationAutocomplete';
import { AddressAutocomplete } from './AddressAutocomplete';
import { EmailInput } from './EmailInput';
import { PhoneInput } from './PhoneInput';
import { Location } from '../data/locations';
import { getCompanyInfoBySiret, validateSiret, CompanyInfo, getCollectiveAgreements, getLabelsAndCertificates, searchCompaniesByName } from '../services/companyService';

interface CompanyFormProps {
  data: Partial<CompanyProfile>;
  onChange: (data: Partial<CompanyProfile>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onPrev 
}) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<SubUser>>({});
  const [siretLoading, setSiretLoading] = useState(false);
  const [siretValidation, setSiretValidation] = useState<{ isValid: boolean; message?: string }>({ isValid: true });
  const [companySearchResults, setCompanySearchResults] = useState<any[]>([]);
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const [showEstablishments, setShowEstablishments] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (field: keyof CompanyProfile, value: any) => {
    onChange({ [field]: value });
  };

  const handleLocationSelect = (location: Location) => {
    handleChange('address', {
      ...data.address,
      city: location.name,
      postalCode: location.postalCode,
      country: 'FR'
    });
  };

  const handleSiretChange = async (siret: string) => {
    const cleanSiret = siret.replace(/\s/g, '');
    handleChange('siret', cleanSiret);
    
    // Validation du format SIRET
    const validation = validateSiret(cleanSiret);
    setSiretValidation(validation);
    
    // Auto-complétion désactivée temporairement
    // Les données doivent être saisies manuellement
    if (cleanSiret.length === 14 && validation.isValid) {
      // Calculer automatiquement le SIREN et le numéro de TVA
      const siren = cleanSiret.substring(0, 9);
      handleChange('siren', siren);
      
      // Générer le numéro de TVA français
      const sirenNumber = parseInt(siren);
      const key = (12 + 3 * (sirenNumber % 97)) % 97;
      const vatNumber = `FR${key.toString().padStart(2, '0')}${siren}`;
      handleChange('vatNumber', vatNumber);
      
      setSiretValidation({ 
        isValid: true, 
        message: 'SIRET valide - Veuillez compléter les informations manuellement' 
      });
    }
  };

  const handleCompanySearch = async (searchTerm: string) => {
    if (searchTerm.length >= 3) {
      try {
        const results = await searchCompaniesByName(searchTerm, 5);
        setCompanySearchResults(results);
        setShowCompanySearch(results.length > 0);
      } catch (error) {
        console.error('Erreur recherche entreprise:', error);
      }
    } else {
      setCompanySearchResults([]);
      setShowCompanySearch(false);
    }
  };

  const handleCompanySelect = (company: any) => {
    handleChange('name', company.name);
    handleChange('denomination', company.denomination);
    handleChange('siret', company.siret);
    handleChange('siren', company.siren);
    handleChange('vatNumber', company.vatNumber);
    handleChange('apeNaf', company.apeNaf);
    handleChange('apeNafLabel', company.apeNafLabel);
    handleChange('legalForm', company.legalForm);
    handleChange('legalFormCode', company.legalFormCode);
    handleChange('rcs', company.rcs || '');
    handleChange('capital', company.capital || 0);
    handleChange('employeeCount', company.employeeCount);
    handleChange('employeeCountRange', company.employeeCountRange);
    handleChange('companySize', company.companySize);
    handleChange('creationDate', company.creationDate);
    
    if (company.address) {
      handleChange('address', {
        street: company.address.street,
        city: company.address.city,
        postalCode: company.address.postalCode,
        country: company.address.country
      });
    }
    
    setShowCompanySearch(false);
    setCompanySearchResults([]);
  };

  const handleAddUser = () => {
    if (currentUser.firstName && currentUser.lastName && currentUser.email && currentUser.role) {
      const newUser: SubUser = {
        id: Date.now().toString(),
        title: currentUser.title || 'mr',
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone || '',
        role: currentUser.role,
        permissions: [],
        activityLog: [],
        createdAt: new Date()
      };

      const currentUsers = data.subUsers || [];
      handleChange('subUsers', [...currentUsers, newUser]);
      setCurrentUser({});
      setShowUserModal(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    const currentUsers = data.subUsers || [];
    handleChange('subUsers', currentUsers.filter(user => user.id !== userId));
  };

  const roleLabels = {
    'hr': 'Ressources Humaines',
    'accounting': 'Comptabilité',
    'project_manager': 'Chargé d\'affaires',
    'admin': 'Administrateur'
  };

  const isValid = data.name && data.siret && data.apeNaf;

  const getCompanySizeLabel = (size: string) => {
    const labels = {
      'TPE': 'Très Petite Entreprise (0-9 salariés)',
      'PME': 'Petite et Moyenne Entreprise (10-249 salariés)',
      'ETI': 'Entreprise de Taille Intermédiaire (250-4999 salariés)',
      'GE': 'Grande Entreprise (5000+ salariés)'
    };
    return labels[size as keyof typeof labels] || size;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Building className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Informations entreprise</h2>
            <p className="text-gray-600">Renseignez les données de votre structure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Logo */}
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer">
                  {data.logo ? (
                    <img src={data.logo} alt="Logo" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        handleChange('logo', e.target?.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Cliquez pour ajouter le logo de votre entreprise</p>
            </div>

            {/* Company Details */}
            <div className="space-y-8">
              {/* Identification */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  Identification
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dénomination / Raison sociale *</label>
                    <input
                      type="text"
                      value={data.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SIREN</label>
                    <input
                      type="text"
                      value={data.siren || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Récupéré automatiquement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SIRET du siège social *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={data.siret || ''}
                        onChange={(e) => handleSiretChange(e.target.value)}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                          !siretValidation.isValid 
                            ? 'border-red-300 focus:ring-red-500' 
                            : siretValidation.message && siretValidation.isValid
                            ? 'border-emerald-300 focus:ring-emerald-500'
                            : 'border-gray-300 focus:ring-purple-500'
                        }`}
                        placeholder="12345678912345"
                        maxLength={14}
                      />
                      
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {siretLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                        ) : siretValidation.message && siretValidation.isValid ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : !siretValidation.isValid && data.siret ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    
                    {siretValidation.message && (
                      <div className={`mt-1 text-sm flex items-center gap-1 ${
                        siretValidation.isValid ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {siretValidation.isValid ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        {siretValidation.message}
                      </div>
                    )}
                    
                    {/* Lien vers l'annuaire officiel */}
                    {data.siret && data.siret.length === 14 && siretValidation.isValid && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <div className="text-sm">
                            <p className="text-blue-800 font-medium mb-1">
                              Récupération automatique des données temporairement désactivée
                            </p>
                            <p className="text-blue-700 mb-2">
                              Vous pouvez consulter les informations officielles de votre entreprise et les saisir manuellement :
                            </p>
                            <a
                              href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${data.siret}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium underline"
                            >
                              Voir sur l'annuaire officiel
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">N° TVA Intracommunautaire</label>
                    <input
                      type="text"
                      value={data.vatNumber || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Calculé automatiquement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">N° EORI</label>
                    <input
                      type="text"
                      value={data.eoriNumber || ''}
                      onChange={(e) => handleChange('eoriNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="FR123456789000"
                    />
                  </div>
                </div>
              </div>

              {/* Activité */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Activité
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code APE/NAF principal *</label>
                    <input
                      type="text"
                      value={data.apeNaf || ''}
                      onChange={(e) => handleChange('apeNaf', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ex: 9001Z (activité principale de l'entreprise)"
                      readOnly={siretLoading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Code APE principal de l'entreprise (unique). Les établissements peuvent avoir des codes APE différents.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Libellé de l'activité principale</label>
                    <input
                      type="text"
                      value={data.apeNafLabel || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Libellé de l'activité principale"
                    />
                  </div>
                </div>
              </div>

              {/* Informations légales */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Informations légales
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Forme juridique</label>
                    <input
                      type="text"
                      value={data.legalForm || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Récupéré automatiquement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RCS</label>
                    <input
                      type="text"
                      value={data.rcs || ''}
                      onChange={(e) => handleChange('rcs', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="RCS Paris 123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capital social (€)</label>
                    <input
                      type="number"
                      value={data.capital || ''}
                      onChange={(e) => handleChange('capital', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de création</label>
                    <input
                      type="date"
                      value={data.creationDate || ''}
                      onChange={(e) => handleChange('creationDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Effectifs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Effectifs
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'employés</label>
                    <input
                      type="number"
                      value={data.employeeCount || ''}
                      onChange={(e) => handleChange('employeeCount', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tranche d'effectifs</label>
                    <input
                      type="text"
                      value={data.employeeCountRange || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Calculé automatiquement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Taille d'entreprise</label>
                    <input
                      type="text"
                      value={data.companySize ? getCompanySizeLabel(data.companySize) : ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Calculé automatiquement"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Adresse du siège social
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète</label>
                    <AddressAutocomplete
                      value={data.address?.street || ''}
                      onChange={(address) => handleChange('address', { ...data.address, street: address })}
                      placeholder="Numéro et nom de rue"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                      <LocationAutocomplete
                        value={data.address?.city || ''}
                        onChange={handleLocationSelect}
                        placeholder="Ville"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                      <input
                        type="text"
                        value={data.address?.postalCode || ''}
                        onChange={(e) => handleChange('address', { ...data.address, postalCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="75001"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                      <select
                        value={data.address?.country || 'FR'}
                        onChange={(e) => handleChange('address', { ...data.address, country: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="FR">France</option>
                        <option value="BE">Belgique</option>
                        <option value="CH">Suisse</option>
                        <option value="LU">Luxembourg</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Établissements */}
              {(data.activeEstablishments?.length || 0) > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Building className="w-5 h-5 text-purple-600" />
                      Établissements ({(data.activeEstablishments?.length || 0) + (data.closedEstablishments?.length || 0)})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowEstablishments(!showEstablishments)}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {showEstablishments ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Masquer
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Afficher
                        </>
                      )}
                    </button>
                  </div>

                  {showEstablishments && (
                    <div className="space-y-4">
                      {data.activeEstablishments && data.activeEstablishments.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            Établissements actifs ({data.activeEstablishments.length})
                          </h4>
                          <div className="space-y-2">
                            {data.activeEstablishments.map((establishment, index) => (
                              <div key={establishment.siret} className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {establishment.isSiege ? '🏢 Siège social' : '📍 Établissement'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      SIRET: {establishment.siret}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {establishment.apeNaf} - {establishment.apeNafLabel}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {establishment.address.street}, {establishment.address.postalCode} {establishment.address.city}
                                    </div>
                                    {establishment.employeeCount && (
                                      <div className="text-sm text-gray-600">
                                        Effectifs: {establishment.employeeCount} ({establishment.employeeCountRange})
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-emerald-600 font-medium">
                                    Actif
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.closedEstablishments && data.closedEstablishments.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <X className="w-4 h-4 text-red-500" />
                            Établissements fermés ({data.closedEstablishments.length})
                          </h4>
                          <div className="space-y-2">
                            {data.closedEstablishments.map((establishment, index) => (
                              <div key={establishment.siret} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {establishment.isSiege ? '🏢 Siège social' : '📍 Établissement'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      SIRET: {establishment.siret}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {establishment.apeNaf} - {establishment.apeNafLabel}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {establishment.address.street}, {establishment.address.postalCode} {establishment.address.city}
                                    </div>
                                    {establishment.closureDate && (
                                      <div className="text-sm text-red-600">
                                        Fermé le: {new Date(establishment.closureDate).toLocaleDateString('fr-FR')}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-red-600 font-medium">
                                    Fermé
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Conventions collectives */}
              {data.collectiveAgreements && data.collectiveAgreements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Conventions collectives applicables
                  </h3>
                  
                  <div className="space-y-3">
                    {data.collectiveAgreements.map((agreement, index) => (
                      <div key={agreement.idcc} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">
                              {agreement.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              IDCC: {agreement.idcc}
                            </div>
                            {agreement.brochureJO && (
                              <div className="text-sm text-gray-600">
                                Brochure JO: {agreement.brochureJO}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            Applicable
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Labels et certificats */}
              {data.labels && data.labels.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      Labels et certificats ({data.labels.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowLabels(!showLabels)}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {showLabels ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Masquer
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Afficher
                        </>
                      )}
                    </button>
                  </div>

                  {showLabels && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.labels.map((label, index) => (
                        <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {label.name}
                              </div>
                              {label.type && (
                                <div className="text-sm text-gray-600">
                                  Type: {label.type}
                                </div>
                              )}
                              {label.validUntil && (
                                <div className="text-sm text-gray-600">
                                  Valide jusqu'au: {new Date(label.validUntil).toLocaleDateString('fr-FR')}
                                </div>
                              )}
                              {label.certifyingBody && (
                                <div className="text-sm text-gray-600">
                                  Organisme: {label.certifyingBody}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Contact
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email principal</label>
                    <EmailInput
                      value={data.email || ''}
                      onChange={(email) => handleChange('email', email)}
                      placeholder="contact@entreprise.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <PhoneInput
                      value={data.phone || ''}
                      onChange={(phone) => handleChange('phone', phone)}
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                    <input
                      type="url"
                      value={data.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://www.entreprise.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fax</label>
                    <input
                      type="tel"
                      value={data.fax || ''}
                      onChange={(e) => handleChange('fax', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>
              </div>

              {/* Utilisateurs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Utilisateurs ({(data.subUsers || []).length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowUserModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un utilisateur
                  </button>
                </div>

                {data.subUsers && data.subUsers.length > 0 && (
                  <div className="space-y-3">
                    {data.subUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {user.email} • {roleLabels[user.role as keyof typeof roleLabels]}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={onPrev}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
              
              <button
                type="submit"
                disabled={!isValid}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isValid
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continuer
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal d'ajout d'utilisateur */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Ajouter un utilisateur</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Civilité</label>
                <select
                  value={currentUser.title || 'mr'}
                  onChange={(e) => setCurrentUser({ ...currentUser, title: e.target.value as 'mr' | 'mrs' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="mr">M.</option>
                  <option value="mrs">Mme</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={currentUser.firstName || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={currentUser.lastName || ''}
                    onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <EmailInput
                  value={currentUser.email || ''}
                  onChange={(email) => setCurrentUser({ ...currentUser, email })}
                  placeholder="jean.dupont@entreprise.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <PhoneInput
                  value={currentUser.phone || ''}
                  onChange={(phone) => setCurrentUser({ ...currentUser, phone })}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
                <select
                  value={currentUser.role || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="hr">Ressources Humaines</option>
                  <option value="accounting">Comptabilité</option>
                  <option value="project_manager">Chargé d'affaires</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddUser}
                disabled={!currentUser.firstName || !currentUser.lastName || !currentUser.email || !currentUser.role}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentUser.firstName && currentUser.lastName && currentUser.email && currentUser.role
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};