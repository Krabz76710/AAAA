import React from 'react';
import { User, Building, FileText, Users, Settings, LogOut, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { useAuth } from '../hooks/useAuth';

interface DashboardProps {
  userType: 'individual' | 'company';
  profileCompletion: number;
  userData: any;
  documents: any[];
  onEditProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userType,
  profileCompletion,
  userData,
  documents,
  onEditProfile
}) => {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.reload(); // Recharger la page pour revenir à l'écran d'accueil
  };
  const getProfileStatus = () => {
    if (profileCompletion === 100) return { status: 'complete', text: 'Profil complet', color: 'text-emerald-600' };
    if (profileCompletion >= 70) return { status: 'almost', text: 'Presque terminé', color: 'text-yellow-600' };
    return { status: 'incomplete', text: 'Profil incomplet', color: 'text-red-600' };
  };

  const getStatusIcon = () => {
    const { status } = getProfileStatus();
    switch (status) {
      case 'complete': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'almost': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const expiringDocuments = documents.filter(doc => {
    if (!doc.expirationDate) return false;
    const expiry = new Date(doc.expirationDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 30 && diffDays >= 0;
  });

  const recentActivity = [
    { action: 'Profil créé', date: new Date(), type: 'profile' },
    { action: 'Document RIB ajouté', date: new Date(Date.now() - 86400000), type: 'document' },
    { action: 'Informations professionnelles mises à jour', date: new Date(Date.now() - 172800000), type: 'profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                {userType === 'individual' ? (
                  <User className="w-6 h-6 text-white" />
                ) : (
                  <Building className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TalentHub</h1>
                <p className="text-sm text-gray-500">
                  {userType === 'individual' ? 'Profil individuel' : 'Profil entreprise'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Bienvenue {userData.firstName ? `${userData.firstName}` : user?.user_metadata?.first_name || ''}
                  {userType === 'company' && userData.name ? userData.name : ''}
                </h2>
                <p className="text-indigo-100 mb-4">
                  {userType === 'individual' 
                    ? 'Gérez votre profil professionnel et vos documents'
                    : 'Administrez votre entreprise et vos collaborateurs'
                  }
                </p>
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className="text-white font-medium">{getProfileStatus().text}</span>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 min-w-48">
                <ProgressBar progress={profileCompletion} showPercentage={false} size="sm" />
                <div className="mt-2 text-center">
                  <span className="text-white font-bold text-lg">{profileCompletion}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  Complétude du profil
                </h3>
                <button
                  onClick={onEditProfile}
                  className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
                >
                  Modifier le profil
                </button>
              </div>

              <ProgressBar progress={profileCompletion} className="mb-6" />

              {profileCompletion < 100 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Étapes manquantes :</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {!userData.firstName && <li>• Informations personnelles incomplètes</li>}
                    {!userData.profession && <li>• Informations professionnelles manquantes</li>}
                    {documents.length === 0 && <li>• Aucun document ajouté (recommandé pour améliorer votre profil)</li>}
                    {userType === 'company' && !userData.subUsers?.length && <li>• Aucun collaborateur ajouté</li>}
                  </ul>
                </div>
              )}
              
              {/* Encourage document upload */}
              {documents.length === 0 && (
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-medium text-indigo-900">Ajoutez vos documents</h4>
                  </div>
                  <p className="text-indigo-700 text-sm mb-3">
                    Sécurisez vos documents importants dans votre coffre-fort numérique.
                  </p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    Ajouter des documents
                  </button>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  Mes documents
                </h3>
                <span className="text-sm text-gray-500">{documents.length} documents</span>
              </div>

              {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.slice(0, 4).map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📄</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.title}</h4>
                          <p className="text-sm text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      {doc.expirationDate && (
                        <p className="text-xs text-gray-400">
                          Expire le {new Date(doc.expirationDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun document ajouté</p>
                </div>
              )}

              {documents.length > 4 && (
                <div className="mt-4 text-center">
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                    Voir tous les documents ({documents.length})
                  </button>
                </div>
              )}
            </div>

            {/* Company Users (for companies only) */}
            {userType === 'company' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-600" />
                    Collaborateurs
                  </h3>
                  <button className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors font-medium">
                    Ajouter un collaborateur
                  </button>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun collaborateur ajouté</p>
                  <p className="text-sm mt-2">Invitez vos collaborateurs à rejoindre votre espace</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Aperçu rapide</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Documents</span>
                  <span className="font-semibold text-gray-900">{documents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Complétude</span>
                  <span className="font-semibold text-gray-900">{profileCompletion}%</span>
                </div>
                {userType === 'company' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Collaborateurs</span>
                    <span className="font-semibold text-gray-900">0</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expiring Documents Alert */}
            {expiringDocuments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-200">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-bold text-gray-900">Documents à renouveler</h3>
                </div>
                <div className="space-y-2">
                  {expiringDocuments.map((doc) => (
                    <div key={doc.id} className="text-sm">
                      <p className="font-medium text-gray-900">{doc.title}</p>
                      <p className="text-yellow-600">
                        Expire le {new Date(doc.expirationDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">
                        {activity.date.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};