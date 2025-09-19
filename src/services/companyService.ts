// Service pour récupérer les informations d'entreprise via les APIs officielles françaises
export interface CompanyInfo {
  name: string;
  denomination: string;
  siret: string;
  siren: string;
  nic: string;
  vatNumber?: string; // N° TVA Intracommunautaire
  eoriNumber?: string; // N° EORI
  rcs?: string;
  apeNaf: string;
  apeNafLabel: string;
  legalForm: string;
  legalFormCode: string;
  capital?: number;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  creationDate?: string;
  employeeCount?: string;
  employeeCountRange?: string;
  companySize?: 'TPE' | 'PME' | 'ETI' | 'GE'; // Taille de la structure
  status: 'active' | 'inactive' | 'ceased';
  collectiveAgreements?: string[];
  labels?: string[];
  certificates?: string[];
  activeEstablishments?: Establishment[];
  closedEstablishments?: Establishment[];
}

export interface Establishment {
  siret: string;
  nic: string;
  apeNaf: string;
  apeNafLabel: string;
  name?: string;
  tradeName?: string; // Enseigne
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  creationDate?: string;
  status: 'active' | 'inactive' | 'ceased';
  isHeadOffice: boolean; // Siège social
}

// Cache pour éviter les appels répétés
const companyCache = new Map<string, CompanyInfo>();

// Fonction pour récupérer les informations d'une entreprise par SIRET
export const getCompanyInfoBySiret = async (siret: string): Promise<CompanyInfo | null> => {
  if (!siret || siret.length !== 14) return null;

  const normalizedSiret = siret.replace(/\s/g, '');
  
  if (companyCache.has(normalizedSiret)) {
    return companyCache.get(normalizedSiret)!;
  }

  try {
    // Utilisation de l'API Sirene de l'INSEE (API officielle du gouvernement français)
    const response = await fetch(
      `/api/insee/entreprises/sirene/V3/siret/${normalizedSiret}`,
      {
        headers: {
          'Accept': 'application/json',
          // Note: En production, il faut s'inscrire sur api.insee.fr pour obtenir une clé API
          // 'Authorization': 'Bearer YOUR_INSEE_API_TOKEN'
        }
      }
    );

    if (!response.ok) {
      // Fallback vers l'API publique entreprise.data.gouv.fr
      return await getCompanyInfoFromDataGouv(normalizedSiret);
    }

   // Vérifier que les données essentielles sont présentes
   if (!etablissement.uniteLegale) {
     console.warn('No legal unit data found in INSEE response');
     return await getCompanyInfoFromDataGouv(normalizedSiret);
   }
    const data = await response.json();
    const etablissement = data.etablissement;
    
    if (!etablissement) return null;

    const companyInfo: CompanyInfo = {
      name: etablissement.uniteLegale?.denominationUniteLegale || 
            `${etablissement.uniteLegale?.prenom1UniteLegale || ''} ${etablissement.uniteLegale?.nomUniteLegale || ''}`.trim(),
      denomination: etablissement.uniteLegale?.denominationUniteLegale || 
                   `${etablissement.uniteLegale?.prenom1UniteLegale || ''} ${etablissement.uniteLegale?.nomUniteLegale || ''}`.trim(),
      siret: etablissement.siret,
      siren: etablissement.siren,
      nic: etablissement.nic,
      vatNumber: generateVatNumber(etablissement.siren),
      apeNaf: etablissement.uniteLegale?.activitePrincipaleUniteLegale, // APE principal de l'entreprise (unité légale)
      apeNafLabel: etablissement.uniteLegale?.nomenclatureActivitePrincipaleUniteLegale || 'Non spécifié',
      legalForm: etablissement.uniteLegale?.categorieJuridiqueUniteLegale || 'Non spécifié',
      legalFormCode: etablissement.uniteLegale?.categorieJuridiqueUniteLegale || '',
      capital: etablissement.uniteLegale?.capitalSocial ? parseFloat(etablissement.uniteLegale.capitalSocial) : undefined,
      address: {
       street: `${etablissement.adresseEtablissement?.numeroVoieEtablissement || ''} ${etablissement.adresseEtablissement?.typeVoieEtablissement || ''} ${etablissement.adresseEtablissement?.libelleVoieEtablissement || ''}`.trim() || 'Adresse non disponible',
        city: etablissement.adresseEtablissement?.libelleCommuneEtablissement || '',
        postalCode: etablissement.adresseEtablissement?.codePostalEtablissement || '',
        country: 'FR'
      },
      creationDate: etablissement.uniteLegale?.dateCreationUniteLegale,
      employeeCount: etablissement.trancheEffectifsEtablissement,
      employeeCountRange: getEmployeeCountRange(etablissement.trancheEffectifsEtablissement),
      companySize: getCompanySize(etablissement.trancheEffectifsEtablissement),
      status: etablissement.etatAdministratifEtablissement === 'A' ? 'active' : 'inactive'
    };

    // Récupérer les établissements de l'entreprise
    try {
      const establishments = await getCompanyEstablishments(etablissement.siren);
     if (establishments && establishments.length > 0) {
       companyInfo.activeEstablishments = establishments.filter(e => e.status === 'active');
       companyInfo.closedEstablishments = establishments.filter(e => e.status !== 'active');
     }
    } catch (error) {
      console.warn('Impossible de récupérer les établissements:', error);
    }

    companyCache.set(normalizedSiret, companyInfo);
    return companyInfo;
  } catch (error) {
    console.error('Erreur API INSEE:', error);
    // Fallback vers l'API publique
    return await getCompanyInfoFromDataGouv(normalizedSiret);
  }
};

// Fallback vers l'API publique entreprise.data.gouv.fr
const getCompanyInfoFromDataGouv = async (siret: string): Promise<CompanyInfo | null> => {
  try {
    const response = await fetch(
      `/api/data-gouv/api/sirene/v1/siret/${siret}`
    );

    if (!response.ok) {
      console.warn(`API Data.gouv returned status ${response.status}`);
      return null;
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.warn('Failed to parse JSON response from Data.gouv API');
      return null;
    }
    
    const etablissement = data.etablissement;
    
    if (!etablissement) return null;

    const companyInfo: CompanyInfo = {
      name: etablissement.unite_legale?.denomination || 
            `${etablissement.unite_legale?.prenom_1 || ''} ${etablissement.unite_legale?.nom || ''}`.trim(),
      denomination: etablissement.unite_legale?.denomination || 
                   `${etablissement.unite_legale?.prenom_1 || ''} ${etablissement.unite_legale?.nom || ''}`.trim(),
      siret: etablissement.siret,
      siren: etablissement.siren,
      nic: etablissement.nic,
      vatNumber: generateVatNumber(etablissement.siren),
      apeNaf: etablissement.unite_legale?.activite_principale || etablissement.activite_principale,
      apeNafLabel: etablissement.unite_legale?.libelle_activite_principale || 'Non spécifié',
      legalForm: etablissement.unite_legale?.forme_juridique || 'Non spécifié',
      legalFormCode: etablissement.unite_legale?.forme_juridique_code || '',
      capital: etablissement.unite_legale?.capital_social ? parseFloat(etablissement.unite_legale.capital_social) : undefined,
      address: {
        street: `${etablissement.geo_adresse || etablissement.adresse || ''}`.trim(),
        city: etablissement.libelle_commune || '',
        postalCode: etablissement.code_postal || '',
        country: 'FR'
      },
      creationDate: etablissement.unite_legale?.date_creation,
      employeeCount: etablissement.tranche_effectif_salarie,
      employeeCountRange: getEmployeeCountRange(etablissement.tranche_effectif_salarie),
      companySize: getCompanySize(etablissement.tranche_effectif_salarie),
      status: etablissement.etat_administratif === 'A' ? 'active' : 'inactive'
    };

    companyCache.set(siret, companyInfo);
    return companyInfo;
  } catch (error) {
    console.warn('API Data.gouv unavailable, using fallback data');
    return null;
  }
};

// Fonction pour rechercher des entreprises par nom
export const searchCompaniesByName = async (name: string, limit: number = 10): Promise<CompanyInfo[]> => {
  if (!name || name.length < 3) return [];

  try {
    const response = await fetch(
      `/api/data-gouv/api/sirene/v1/full_text/${encodeURIComponent(name)}?per_page=${limit}`
    );

    if (!response.ok) {
      console.warn(`Company search API returned status ${response.status}`);
      return [];
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.warn('Failed to parse JSON response from company search API');
      return [];
    }
    
    return data.etablissement?.map((etab: any) => ({
      name: etab.unite_legale?.denomination || 
            `${etab.unite_legale?.prenom_1 || ''} ${etab.unite_legale?.nom || ''}`.trim(),
      denomination: etab.unite_legale?.denomination || 
                   `${etab.unite_legale?.prenom_1 || ''} ${etab.unite_legale?.nom || ''}`.trim(),
      siret: etab.siret,
      siren: etab.siren,
      nic: etab.nic,
      vatNumber: generateVatNumber(etab.siren),
      apeNaf: etab.unite_legale?.activite_principale || etab.activite_principale,
      apeNafLabel: etab.unite_legale?.libelle_activite_principale || 'Non spécifié',
      legalForm: etab.unite_legale?.forme_juridique || 'Non spécifié',
      legalFormCode: etab.unite_legale?.forme_juridique_code || '',
      capital: etab.unite_legale?.capital_social ? parseFloat(etab.unite_legale.capital_social) : undefined,
      address: {
        street: `${etab.geo_adresse || etab.adresse || ''}`.trim(),
        city: etab.libelle_commune || '',
        postalCode: etab.code_postal || '',
        country: 'FR'
      },
      creationDate: etab.unite_legale?.date_creation,
      employeeCount: etab.tranche_effectif_salarie,
      employeeCountRange: getEmployeeCountRange(etab.tranche_effectif_salarie),
      companySize: getCompanySize(etab.tranche_effectif_salarie),
      status: etab.etat_administratif === 'A' ? 'active' : 'inactive'
    })) || [];
  } catch (error) {
    console.warn('Company search API unavailable');
    return [];
  }
};

// Fonction pour récupérer les informations d'activité APE/NAF
export const getApeNafInfo = async (apeCode: string): Promise<{ code: string; label: string } | null> => {
  if (!apeCode) return null;

  try {
    // Utilisation de l'API nomenclatures de l'INSEE
    const response = await fetch(
      `/api/insee/metadonnees/V1/codes/nafr2/n5/${apeCode}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    
    return {
      code: apeCode,
      label: data.intitule || 'Libellé non trouvé'
    };
  } catch (error) {
    console.error('Erreur récupération APE/NAF:', error);
    return null;
  }
};

// Fonction pour récupérer tous les établissements d'une entreprise
export const getCompanyEstablishments = async (siren: string): Promise<Establishment[]> => {
  if (!siren || siren.length !== 9) return [];

  try {
    const response = await fetch(
      `/api/insee/entreprises/sirene/V3/siren/${siren}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      // Fallback vers l'API publique
      return await getEstablishmentsFromDataGouv(siren);
    }

    const data = await response.json();
    const etablissements = data.etablissements || [];
    
    return etablissements.map((etab: any) => ({
      siret: etab.siret,
      nic: etab.nic,
      apeNaf: etab.activitePrincipaleEtablissement,
      apeNafLabel: etab.nomenclatureActivitePrincipaleEtablissement || 'Non spécifié',
      name: etab.denominationUsuelleEtablissement || '',
      tradeName: etab.enseigne1Etablissement || '',
      address: {
        street: `${etab.adresseEtablissement?.numeroVoieEtablissement || ''} ${etab.adresseEtablissement?.typeVoieEtablissement || ''} ${etab.adresseEtablissement?.libelleVoieEtablissement || ''}`.trim(),
        city: etab.adresseEtablissement?.libelleCommuneEtablissement || '',
        postalCode: etab.adresseEtablissement?.codePostalEtablissement || '',
        country: 'FR'
      },
      creationDate: etab.dateCreationEtablissement,
      status: etab.etatAdministratifEtablissement === 'A' ? 'active' : 'inactive',
      isHeadOffice: etab.etablissementSiege === 'true'
    }));
  } catch (error) {
    console.error('Erreur récupération établissements:', error);
    return [];
  }
};

// Fallback pour les établissements
const getEstablishmentsFromDataGouv = async (siren: string): Promise<Establishment[]> => {
  try {
    const response = await fetch(
      `/api/data-gouv/api/sirene/v1/siren/${siren}`
    );

    if (!response.ok) {
      console.warn(`Establishments API returned status ${response.status}`);
      return [];
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.warn('Failed to parse JSON response from establishments API');
      return [];
    }
    
    const etablissements = data.etablissements || [];
    
    return etablissements.map((etab: any) => ({
      siret: etab.siret,
      nic: etab.nic,
      apeNaf: etab.activite_principale,
      apeNafLabel: etab.libelle_activite_principale || 'Non spécifié',
      name: etab.nom_commercial || '',
      tradeName: etab.enseigne || '',
      address: {
        street: etab.geo_adresse || etab.adresse || '',
        city: etab.libelle_commune || '',
        postalCode: etab.code_postal || '',
        country: 'FR'
      },
      creationDate: etab.date_creation,
      status: etab.etat_administratif === 'A' ? 'active' : 'inactive',
      isHeadOffice: etab.etablissement_siege === 'true'
    }));
  } catch (error) {
    console.warn('Establishments API unavailable');
    return [];
  }
};

// Fonction pour générer le numéro de TVA intracommunautaire
const generateVatNumber = (siren: string): string => {
  if (!siren || siren.length !== 9) return '';
  
  // Calcul de la clé de contrôle pour le numéro de TVA français
  const sirenNumber = parseInt(siren);
  const key = (12 + 3 * (sirenNumber % 97)) % 97;
  
  return `FR${key.toString().padStart(2, '0')}${siren}`;
};

// Fonction pour obtenir la tranche d'effectif en texte
const getEmployeeCountRange = (code?: string): string => {
  const ranges: { [key: string]: string } = {
    'NN': 'Non déterminé',
    '00': '0 salarié',
    '01': '1 ou 2 salariés',
    '02': '3 à 5 salariés',
    '03': '6 à 9 salariés',
    '11': '10 à 19 salariés',
    '12': '20 à 49 salariés',
    '21': '50 à 99 salariés',
    '22': '100 à 199 salariés',
    '31': '200 à 249 salariés',
    '32': '250 à 499 salariés',
    '41': '500 à 999 salariés',
    '42': '1000 à 1999 salariés',
    '51': '2000 à 4999 salariés',
    '52': '5000 à 9999 salariés',
    '53': '10000 salariés et plus'
  };
  
  return ranges[code || 'NN'] || 'Non déterminé';
};

// Fonction pour déterminer la taille de l'entreprise
const getCompanySize = (employeeCode?: string): 'TPE' | 'PME' | 'ETI' | 'GE' => {
  if (!employeeCode) return 'TPE';
  
  // TPE: 0-9 salariés
  if (['00', '01', '02', '03'].includes(employeeCode)) return 'TPE';
  
  // PME: 10-249 salariés
  if (['11', '12', '21', '22', '31'].includes(employeeCode)) return 'PME';
  
  // ETI: 250-4999 salariés
  if (['32', '41', '42', '51'].includes(employeeCode)) return 'ETI';
  
  // GE: 5000+ salariés
  return 'GE';
};

// Fonction pour récupérer les conventions collectives (simulation)
export const getCollectiveAgreements = async (apeCode: string): Promise<string[]> => {
  // En production, utiliser l'API du ministère du travail
  // https://api.travail-emploi.gouv.fr/conventions-collectives
  
  const commonAgreements: { [key: string]: string[] } = {
    '9001Z': ['Convention collective nationale du spectacle vivant'],
    '5911A': ['Convention collective de la production cinématographique'],
    '5912Z': ['Convention collective de la production audiovisuelle'],
    '7729Z': ['Convention collective de la location de matériel'],
    '8230Z': ['Convention collective de l\'organisation d\'événements']
  };
  
  return commonAgreements[apeCode] || [];
};

// Fonction pour récupérer les labels et certificats (simulation)
export const getLabelsAndCertificates = async (siren: string): Promise<string[]> => {
  // En production, utiliser des APIs spécialisées ou bases de données
  // comme Qualiopi, ISO, etc.
  
  // Simulation basée sur le SIREN
  const mockLabels = [
    'Qualiopi',
    'ISO 9001',
    'ISO 14001',
    'OHSAS 18001',
    'Label Diversité',
    'Label Égalité professionnelle'
  ];
  
  // Retourner quelques labels aléatoires basés sur le SIREN
  const seed = parseInt(siren.slice(-3));
  const selectedLabels = mockLabels.filter((_, index) => (seed + index) % 3 === 0);
  
  return selectedLabels;
};

// Fonction pour valider un SIRET
export const validateSiret = (siret: string): { isValid: boolean; message?: string } => {
  const cleaned = siret.replace(/\s/g, '');
  
  if (cleaned.length !== 14) {
    return { isValid: false, message: 'Le SIRET doit contenir 14 chiffres' };
  }
  
  if (!/^\d{14}$/.test(cleaned)) {
    return { isValid: false, message: 'Le SIRET ne doit contenir que des chiffres' };
  }
  
  // Algorithme de validation Luhn pour SIRET
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(cleaned[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  
  if (sum % 10 !== 0) {
    return { isValid: false, message: 'Numéro SIRET invalide (échec validation)' };
  }
  
  return { isValid: true };
};

// Fonction pour vider le cache
export const clearCompanyCache = () => {
  companyCache.clear();
};