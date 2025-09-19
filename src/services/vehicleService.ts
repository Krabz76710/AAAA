// Service pour récupérer les informations de véhicules via l'API officielle
export interface VehicleInfo {
  brand: string;
  model: string;
  year?: number;
  color?: string;
  fuelType?: 'essence' | 'diesel' | 'electrique' | 'hybride' | 'gpl' | 'autre';
  power?: number;
  weight?: number;
  category?: 'voiture' | 'utilitaire' | 'camion' | 'moto' | 'remorque' | 'semi_remorque';
}

// Cache pour éviter les appels répétés
const vehicleCache = new Map<string, VehicleInfo>();

// Fonction pour récupérer les informations d'un véhicule par sa plaque
export const getVehicleInfoByPlate = async (licensePlate: string): Promise<VehicleInfo | null> => {
  if (!licensePlate || licensePlate.length < 7) return null;

  const normalizedPlate = licensePlate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  if (vehicleCache.has(normalizedPlate)) {
    return vehicleCache.get(normalizedPlate)!;
  }

  try {
    // IMPORTANT: Cette fonction utilise des données simulées !
    // En production, vous devriez utiliser une vraie API comme :
    // - API SIV (Système d'Immatriculation des Véhicules) du gouvernement français
    // - API de services tiers comme AutoPlus, OuiFlotte, etc.
    // 
    // Exemple d'appel API réel (commenté) :
    // const response = await fetch(`https://api.siv.gouv.fr/vehicules/${normalizedPlate}`, {
    //   headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
    // });
    // if (response.ok) {
    //   const vehicleData = await response.json();
    //   return mapApiResponseToVehicleInfo(vehicleData);
    // }
    
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ⚠️ DONNÉES SIMULÉES - PAS DE VRAIES DONNÉES DE VÉHICULES ⚠️
    // Cette fonction génère des données aléatoires pour la démonstration
    const mockVehicleInfo = generateMockVehicleInfo(normalizedPlate);
    
    if (mockVehicleInfo) {
      vehicleCache.set(normalizedPlate, mockVehicleInfo);
      return mockVehicleInfo;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations du véhicule:', error);
    return null;
  }
};

// ⚠️ FONCTION DE SIMULATION - À REMPLACER PAR UNE VRAIE API ⚠️
// Cette fonction génère des données fictives basées sur la plaque d'immatriculation
// Elle ne correspond PAS aux vraies informations du véhicule !
const generateMockVehicleInfo = (plate: string): VehicleInfo | null => {
  console.warn(`⚠️ SIMULATION: Génération de données fictives pour la plaque ${plate}`);
  console.warn('Ces données ne correspondent pas au vrai véhicule !');
  
  // Données simulées - NE CORRESPONDENT PAS À LA RÉALITÉ
  const brands = ['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Fiat', 'Opel'];
  const models = {
    'Renault': ['Clio', 'Megane', 'Captur', 'Scenic', 'Kadjar'],
    'Peugeot': ['208', '308', '3008', '5008', '2008'],
    'Citroën': ['C3', 'C4', 'C5 Aircross', 'Berlingo', 'Jumpy'],
    'Volkswagen': ['Golf', 'Polo', 'Tiguan', 'Passat', 'T-Roc'],
    'Ford': ['Fiesta', 'Focus', 'Kuga', 'Mondeo', 'Transit'],
    'BMW': ['Serie 1', 'Serie 3', 'X1', 'X3', 'X5'],
    'Mercedes': ['Classe A', 'Classe C', 'GLA', 'GLC', 'Sprinter'],
    'Audi': ['A1', 'A3', 'Q2', 'Q3', 'Q5'],
    'Fiat': ['500', 'Panda', 'Tipo', 'Scudo', 'Ducato'],
    'Opel': ['Corsa', 'Astra', 'Crossland', 'Vivaro', 'Movano']
  };
  
  const colors = ['Blanc', 'Noir', 'Gris', 'Rouge', 'Bleu', 'Argent'];
  const fuelTypes: Array<'essence' | 'diesel' | 'electrique' | 'hybride'> = ['essence', 'diesel', 'electrique', 'hybride'];
  
  // Utiliser la plaque comme seed pour générer des données cohérentes mais fictives
  const seed = plate.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const brand = brands[seed % brands.length];
  const modelList = models[brand as keyof typeof models];
  const model = modelList[seed % modelList.length];
  const color = colors[seed % colors.length];
  const fuelType = fuelTypes[seed % fuelTypes.length];
  
  // Générer une année entre 2010 et 2024
  const year = 2010 + (seed % 15);
  
  // Générer une puissance entre 70 et 200 CV
  const power = 70 + (seed % 131);
  
  // Générer un poids entre 1000 et 2500 kg
  const weight = 1000 + (seed % 1501);
  
  // Déterminer la catégorie basée sur la marque et le modèle
  let category: 'voiture' | 'utilitaire' | 'camion' = 'voiture';
  if (model.includes('Transit') || model.includes('Sprinter') || model.includes('Jumpy') || model.includes('Berlingo')) {
    category = 'utilitaire';
  }
  
  return {
    brand,
    model,
    year,
    color,
    fuelType,
    power,
    weight,
    category
  };
};

// Fonction pour vider le cache
export const clearVehicleCache = () => {
  vehicleCache.clear();
};