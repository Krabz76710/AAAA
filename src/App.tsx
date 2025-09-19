import React, { useMemo } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StepIndicator } from './components/StepIndicator';
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { ProfessionalInfoForm } from './components/ProfessionalInfoForm';
import { CompanyForm } from './components/CompanyForm';
import { DocumentVault } from './components/DocumentVault';
import { Dashboard } from './components/Dashboard';
import { useRegistration } from './hooks/useRegistration';
import { IndividualProfile, CompanyProfile } from './types';

function App() {
  const {
    currentStep,
    setCurrentStep,
    userType,
    setUserType,
    formData,
    updateFormData,
    documents,
    addDocument,
    removeDocument,
    profileCompletion,
    isLoading,
    nextStep,
    prevStep,
    clearRegistration
  } = useRegistration();

  // Define steps based on user type
  const steps = useMemo(() => {
    if (!userType) return [];
    
    if (userType === 'individual') {
      return [
        { id: 'personal', title: 'Personnel', description: 'Infos de base' },
        { id: 'professional', title: 'Professionnel', description: 'Activité' },
        { id: 'documents', title: 'Documents', description: 'Coffre-fort' },
        { id: 'validation', title: 'Validation', description: 'Vérification' }
      ];
    }
    
    return [
      { id: 'company', title: 'Entreprise', description: 'Infos société' },
      { id: 'documents', title: 'Documents', description: 'Légaux' },
      { id: 'validation', title: 'Validation', description: 'Vérification' }
    ];
  }, [userType]);

  const completedSteps = useMemo(() => {
    const completed: string[] = [];
    
    if (userType === 'individual') {
      const data = formData as Partial<IndividualProfile>;
      if (data.firstName && data.lastName && data.email) completed.push('personal');
      if (data.status && data.profession) completed.push('professional');
      // Documents step is always considered completed (optional)
      completed.push('documents');
    } else if (userType === 'company') {
      const data = formData as Partial<CompanyProfile>;
      if (data.name && data.siret && data.apeNaf) completed.push('company');
      // Documents step is always considered completed (optional)
      completed.push('documents');
    }
    
    return completed;
  }, [userType, formData, documents]);

  const handleStart = (selectedType: 'individual' | 'company') => {
    setUserType(selectedType);
    setCurrentStep(selectedType === 'individual' ? 'personal' : 'company');
  };

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      
      case 'personal':
        return (
          <PersonalInfoForm
            data={formData as Partial<IndividualProfile>}
            onChange={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      
      case 'professional':
        return (
          <ProfessionalInfoForm
            data={formData as Partial<IndividualProfile>}
            onChange={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      
      case 'company':
        return (
          <CompanyForm
            data={formData as Partial<CompanyProfile>}
            onChange={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      
      case 'documents':
        return (
          <DocumentVault
            documents={documents}
            onAddDocument={addDocument}
            onRemoveDocument={removeDocument}
            onNext={nextStep}
            onPrev={prevStep}
            userType={userType!}
          />
        );
      
      case 'validation':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Inscription terminée !</h2>
                <p className="text-gray-600 mb-8">
                  Votre profil est maintenant créé. Vous allez être redirigé vers votre tableau de bord.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Complétude du profil</span>
                    <span className="font-semibold text-gray-900">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setCurrentStep('dashboard')}
                  className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                >
                  Accéder au tableau de bord
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <Dashboard
            userType={userType!}
            profileCompletion={profileCompletion}
            userData={formData}
            documents={documents}
            onEditProfile={() => setCurrentStep(userType === 'individual' ? 'personal' : 'company')}
          />
        );
      
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Step Indicator - only show during registration flow */}
      {userType && currentStep !== 'welcome' && currentStep !== 'dashboard' && currentStep !== 'validation' && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>
      )}
      
      {/* Main Content */}
      {renderCurrentStep()}
      
      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-xs">
          <div className="mb-2">
            <strong>Debug Info:</strong>
          </div>
          <div>Step: {currentStep}</div>
          <div>Type: {userType || 'none'}</div>
          <div>Progress: {profileCompletion}%</div>
          <div>Documents: {documents.length}</div>
          <button
            onClick={clearRegistration}
            className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default App;