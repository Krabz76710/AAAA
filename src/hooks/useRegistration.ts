import { useState, useCallback, useEffect } from 'react';
import { User, IndividualProfile, CompanyProfile, RegistrationStep } from '../types';

export const useRegistration = () => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('welcome');
  const [userType, setUserType] = useState<'individual' | 'company' | null>(null);
  const [formData, setFormData] = useState<Partial<IndividualProfile | CompanyProfile>>({});
  const [documents, setDocuments] = useState<any[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem('registrationData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData || {});
      setUserType(parsed.userType || null);
      setCurrentStep(parsed.currentStep || 'welcome');
      setDocuments(parsed.documents || []);
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      formData,
      userType,
      currentStep,
      documents
    };
    localStorage.setItem('registrationData', JSON.stringify(dataToSave));
  }, [formData, userType, currentStep, documents]);

  const updateFormData = useCallback((newData: Partial<IndividualProfile | CompanyProfile>) => {
    setFormData(prev => ({ ...prev, ...newData }));
    
    // Auto-detect user type based on form fields
    if (!userType) {
      if ('siret' in newData || 'rcs' in newData || 'name' in newData) {
        setUserType('company');
      } else if ('firstName' in newData || 'lastName' in newData || 'socialSecurityNumber' in newData) {
        setUserType('individual');
      }
    }
  }, [userType]);

  const calculateProgress = useCallback(() => {
    if (!userType) return 0;
    
    let totalFields = 0;
    let filledFields = 0;

    if (userType === 'individual') {
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'birthDate', 'birthPlace',
        'status', 'socialSecurityNumber', 'profession'
      ];
      totalFields = requiredFields.length + 2; // +2 for optional document categories
      
      requiredFields.forEach(field => {
        if (formData[field as keyof typeof formData]) filledFields++;
      });
      
      // Add points for documents (optional but boost completion)
      if (documents.some(d => d.type === 'rib')) filledFields += 0.5;
      if (documents.some(d => d.type === 'id_card')) filledFields += 0.5;
      if (documents.length > 2) filledFields += 1;
    } else {
      const requiredFields = ['name', 'siret', 'rcs', 'apeNaf'];
      totalFields = requiredFields.length + 1.5; // +1.5 for optional documents and sub-users
      
      requiredFields.forEach(field => {
        if (formData[field as keyof typeof formData]) filledFields++;
      });
      
      if (documents.some(d => d.type === 'kbis')) filledFields += 0.5;
      if ((formData as CompanyProfile).subUsers?.length > 0) filledFields += 1;
    }

    const progress = Math.round((filledFields / totalFields) * 100);
    setProfileCompletion(progress);
    return progress;
  }, [userType, formData, documents]);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  const nextStep = useCallback(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const steps: RegistrationStep[] = userType === 'individual' 
        ? ['welcome', 'personal', 'professional', 'documents', 'validation', 'dashboard']
        : ['welcome', 'company', 'documents', 'validation', 'dashboard'];
      
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
      }
      setIsLoading(false);
    }, 500);
  }, [currentStep, userType]);

  const prevStep = useCallback(() => {
    const steps: RegistrationStep[] = userType === 'individual' 
      ? ['welcome', 'personal', 'professional', 'documents', 'validation', 'dashboard']
      : ['welcome', 'company', 'documents', 'validation', 'dashboard'];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep, userType]);

  const addDocument = useCallback((document: any) => {
    setDocuments(prev => [...prev, { ...document, id: Date.now().toString() }]);
  }, []);

  const removeDocument = useCallback((documentId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== documentId));
  }, []);

  const clearRegistration = useCallback(() => {
    localStorage.removeItem('registrationData');
    setFormData({});
    setUserType(null);
    setCurrentStep('welcome');
    setDocuments([]);
    setProfileCompletion(0);
  }, []);

  return {
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
  };
};