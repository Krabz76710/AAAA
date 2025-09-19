import React, { useState } from 'react';
import { Upload, FileText, Calendar, AlertCircle, Check, X, Eye, Download } from 'lucide-react';
import { Document } from '../types';

interface DocumentVaultProps {
  documents: Document[];
  onAddDocument: (document: Partial<Document>) => void;
  onRemoveDocument: (documentId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  userType: 'individual' | 'company';
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  onAddDocument,
  onRemoveDocument,
  onNext,
  onPrev,
  userType
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUpload, setCurrentUpload] = useState<Partial<Document>>({});

  const documentTypes = userType === 'individual' ? {
    'rib': 'RIB',
    'id_card': 'Carte d\'identité',
    'diploma': 'Diplôme',
    'caces': 'CACES',
    'medical': 'Visite médicale',
    'certification': 'Certification',
    'other': 'Autre'
  } : {
    'kbis': 'Kbis',
    'insurance': 'Assurance',
    'urssaf': 'Attestation URSSAF',
    'tax': 'Attestation fiscale',
    'license': 'Licence',
    'other': 'Autre'
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'rib': return '💳';
      case 'id_card': return '🆔';
      case 'diploma': return '🎓';
      case 'caces': return '🏗️';
      case 'medical': return '🏥';
      case 'kbis': return '🏢';
      case 'insurance': return '🛡️';
      default: return '📄';
    }
  };

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expiry = new Date(expirationDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expiry = new Date(expirationDate);
    const now = new Date();
    return expiry < now;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentUpload({
        ...currentUpload,
        file,
        fileName: file.name
      });
    }
  };

  const handleAddDocument = () => {
    if (currentUpload.title && currentUpload.type && currentUpload.obtainedDate) {
      onAddDocument({
        ...currentUpload,
        uploadedAt: new Date()
      });
      setCurrentUpload({});
      setShowUploadModal(false);
    }
  };

  const requiredDocuments = userType === 'individual' 
    ? ['rib', 'id_card']
    : ['kbis', 'insurance'];

  // Documents are now optional during registration
  const hasRequiredDocuments = true;
  
  const missingRequiredDocuments = requiredDocuments.filter(type => 
    !documents.some(doc => doc.type === type)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Coffre-fort numérique</h2>
            <p className="text-gray-600">Ajoutez vos documents importants en toute sécurité</p>
          </div>

          {/* Documents Information */}
          {missingRequiredDocuments.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Documents recommandés</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Pour compléter votre profil, nous recommandons d'ajouter : {missingRequiredDocuments.map(type => documentTypes[type as keyof typeof documentTypes]).join(', ')}
              </p>
              <p className="text-blue-600 text-xs mt-2">
                Vous pouvez ajouter ces documents maintenant ou plus tard depuis votre tableau de bord.
              </p>
            </div>
          )}

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {documents.map((document) => (
              <div key={document.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getDocumentIcon(document.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{document.title}</h3>
                      <p className="text-sm text-gray-500">{documentTypes[document.type as keyof typeof documentTypes]}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveDocument(document.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Obtenu le {new Date(document.obtainedDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {document.expirationDate && (
                    <div className={`flex items-center gap-2 ${
                      isExpired(document.expirationDate) ? 'text-red-600' :
                      isExpiringSoon(document.expirationDate) ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isExpired(document.expirationDate) ? 'Expiré le ' : 'Expire le '}
                        {new Date(document.expirationDate).toLocaleDateString('fr-FR')}
                      </span>
                      {isExpired(document.expirationDate) && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {isExpiringSoon(document.expirationDate) && !isExpired(document.expirationDate) && 
                        <AlertCircle className="w-4 h-4 text-yellow-500" />}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                </div>
              </div>
            ))}

            {/* Add Document Card */}
            <div
              onClick={() => setShowUploadModal(true)}
              className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 group-hover:text-indigo-500 mx-auto mb-4 transition-colors" />
                <h3 className="font-semibold text-gray-900 mb-2">Ajouter un document</h3>
                <p className="text-sm text-gray-500">Cliquez pour télécharger un fichier</p>
              </div>
            </div>
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Ajouter un document</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre du document *</label>
                    <input
                      type="text"
                      value={currentUpload.title || ''}
                      onChange={(e) => setCurrentUpload({ ...currentUpload, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Ex: RIB Société Générale"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de document *</label>
                    <select
                      value={currentUpload.type || ''}
                      onChange={(e) => setCurrentUpload({ ...currentUpload, type: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un type</option>
                      {Object.entries(documentTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fichier *</label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date d'obtention *</label>
                      <input
                        type="date"
                        value={currentUpload.obtainedDate || ''}
                        onChange={(e) => setCurrentUpload({ ...currentUpload, obtainedDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                      <input
                        type="date"
                        value={currentUpload.expirationDate || ''}
                        onChange={(e) => setCurrentUpload({ ...currentUpload, expirationDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddDocument}
                      disabled={!currentUpload.title || !currentUpload.type || !currentUpload.obtainedDate || !currentUpload.file}
                      className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                        currentUpload.title && currentUpload.type && currentUpload.obtainedDate && currentUpload.file
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skip Documents Option */}
          {documents.length === 0 && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-gray-600 text-sm mb-2">
                Vous n'avez pas de documents à ajouter maintenant ?
              </p>
              <p className="text-gray-500 text-xs">
                Pas de problème ! Vous pourrez les ajouter plus tard depuis votre tableau de bord.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={onPrev}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Précédent
            </button>
            <button
              onClick={onNext}
              className="flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
            >
              {documents.length > 0 ? 'Continuer' : 'Passer cette étape'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};