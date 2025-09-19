export interface User {
  id: string;
  email: string;
  type: 'individual' | 'company';
  profile: IndividualProfile | CompanyProfile;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  profileCompletion: number;
  isActive: boolean;
}

export interface IndividualProfile {
  // Personal Info
  title: 'mr' | 'mrs' | 'other';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  birthPlace: string;
  address: Address;
  
  // Professional Info
  status: 'freelance' | 'intermittent' | 'auto_entrepreneur' | 'other';
  socialSecurityNumber: string;
  entertainmentLeave: boolean;
  guso: boolean;
  profession: string;
  specialty: string[];
  skills: string[];
  formations: string[];
  licenses: string[];
  caces: string[];
  certifications: string[];
  languages: Language[];
  vehicle: boolean;
  
  // Véhicules
  vehicles: Vehicle[];
  
  // Champs texte au lieu de booléens
  entertainmentLeave: string; // Au lieu de boolean
  guso: string; // Au lieu de boolean
  
  completionSteps: {
    personal: boolean;
    professional: boolean;
    documents: boolean;
  };
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  color?: string;
  year?: number;
  fuelType?: 'essence' | 'diesel' | 'electrique' | 'hybride' | 'gpl' | 'autre';
  power?: number; // Puissance en CV
  dimensions?: {
    length: number; // Longueur en mètres
    width: number;  // Largeur en mètres
    height: number; // Hauteur en mètres
  };
  weight?: number; // Poids en kg
  category?: 'voiture' | 'utilitaire' | 'camion' | 'moto' | 'remorque' | 'semi_remorque';
  insurance?: string; // Date d'expiration assurance
  technicalControl?: string; // Date d'expiration contrôle technique
}

export interface CompanyProfile {
  // Company Info
  name: string;
  denomination: string;
  logo?: string;
  address: Address;
  siret: string;
  siren: string;
  vatNumber?: string; // N° TVA Intracommunautaire
  eoriNumber?: string; // N° EORI
  rcs: string;
  capital: number;
  apeNaf: string; // Code APE principal de l'entreprise (unique)
  apeNafLabel?: string; // Libellé de l'activité principale
  legalForm?: string;
  legalFormCode?: string;
  employeeCount?: string;
  employeeCountRange?: string;
  companySize?: 'TPE' | 'PME' | 'ETI' | 'GE';
  creationDate?: string;
  collectiveAgreements?: string[];
  labels?: string[];
  certificates?: string[];
  license: string;
  
  // Établissements
  activeEstablishments?: CompanyEstablishment[];
  closedEstablishments?: CompanyEstablishment[];
  
  // Sub-users
  subUsers: SubUser[];
  
  completionSteps: {
    company: boolean;
    documents: boolean;
    users: boolean;
  };
}

export interface CompanyEstablishment {
  siret: string;
  nic: string;
  apeNaf: string; // Code APE spécifique à cet établissement (peut être différent du siège)
  apeNafLabel: string; // Libellé de l'activité de cet établissement
  name?: string;
  tradeName?: string;
  address: Address;
  creationDate?: string;
  status: 'active' | 'inactive' | 'ceased';
  isHeadOffice: boolean;
}

export interface SubUser {
  id: string;
  title: 'mr' | 'mrs' | 'other';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'hr' | 'accounting' | 'project_manager' | 'admin';
  permissions: Permission[];
  activityLog: ActivityLog[];
  createdAt: Date;
}

export interface Address {
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Language {
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'native';
}

export interface Document {
  id: string;
  title: string;
  type: 'rib' | 'id_card' | 'diploma' | 'caces' | 'medical' | 'certification' | 'kbis' | 'insurance' | 'other';
  file: File | null;
  fileName: string;
  obtainedDate: string;
  expirationDate?: string;
  uploadedAt: Date;
}

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete')[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  details: string;
}

export type RegistrationStep = 'welcome' | 'personal' | 'professional' | 'company' | 'documents' | 'validation' | 'dashboard';