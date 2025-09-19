import { Location } from '../data/locations';

// Interface pour l'API geo.api.gouv.fr
interface GeoApiCity {
  nom: string;
  code: string;
  codesPostaux: string[];
  codeDepartement: string;
  codeRegion: string;
  population: number;
  centre: {
    coordinates: [number, number];
  };
}

interface GeoApiDepartment {
  nom: string;
  code: string;
}

interface GeoApiRegion {
  nom: string;
  code: string;
}

// Cache pour éviter les appels répétés
const cache = new Map<string, Location[]>();
const departmentCache = new Map<string, string>();
const regionCache = new Map<string, string>();

// Fonction pour obtenir le nom du département
const getDepartmentName = async (code: string): Promise<string> => {
  if (departmentCache.has(code)) {
    return departmentCache.get(code)!;
  }

  try {
    const response = await fetch(`https://geo.api.gouv.fr/departements/${code}`);
    if (response.ok) {
      const dept: GeoApiDepartment = await response.json();
      departmentCache.set(code, dept.nom);
      return dept.nom;
    }
  } catch (error) {
    console.warn('Erreur lors de la récupération du département:', error);
  }
  
  return code; // Fallback au code si l'API échoue
};

// Fonction pour obtenir le nom de la région
const getRegionName = async (code: string): Promise<string> => {
  if (regionCache.has(code)) {
    return regionCache.get(code)!;
  }

  try {
    const response = await fetch(`https://geo.api.gouv.fr/regions/${code}`);
    if (response.ok) {
      const region: GeoApiRegion = await response.json();
      regionCache.set(code, region.nom);
      return region.nom;
    }
  } catch (error) {
    console.warn('Erreur lors de la récupération de la région:', error);
  }
  
  return code; // Fallback au code si l'API échoue
};

// Fonction de recherche de villes via l'API officielle française
export const searchFrenchCities = async (query: string, limit: number = 10): Promise<Location[]> => {
  if (!query || query.length < 2) return [];

  const cacheKey = `${query.toLowerCase()}-${limit}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    // Utilisation de l'API officielle du gouvernement français
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=nom,code,codesPostaux,codeDepartement,codeRegion,population,centre&format=json&geometry=centre&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Erreur API');
    }

    const cities: GeoApiCity[] = await response.json();
    
    // Conversion vers notre format avec gestion des codes postaux multiples
    const locations: Location[] = [];
    
    for (const city of cities) {
      // Récupération des noms de département et région
      const departmentName = await getDepartmentName(city.codeDepartement);
      const regionName = await getRegionName(city.codeRegion);
      
      // Une ville peut avoir plusieurs codes postaux
      for (const postalCode of city.codesPostaux) {
        locations.push({
          name: city.nom,
          postalCode: postalCode,
          department: departmentName,
          region: regionName,
          coordinates: {
            lat: city.centre.coordinates[1],
            lng: city.centre.coordinates[0]
          }
        });
      }
    }

    // Tri par population (les plus grandes villes en premier) puis par nom
    locations.sort((a, b) => {
      const cityA = cities.find(c => c.nom === a.name);
      const cityB = cities.find(c => c.nom === b.name);
      
      if (cityA && cityB) {
        if (cityB.population !== cityA.population) {
          return cityB.population - cityA.population;
        }
      }
      
      return a.name.localeCompare(b.name);
    });

    // Limitation des résultats
    const limitedResults = locations.slice(0, limit);
    
    // Mise en cache
    cache.set(cacheKey, limitedResults);
    
    return limitedResults;
  } catch (error) {
    console.error('Erreur lors de la recherche de villes:', error);
    
    // Fallback vers notre base locale en cas d'erreur API
    const { searchLocations } = await import('../data/locations');
    return searchLocations(query, limit);
  }
};

// Fonction pour rechercher par code postal
export const searchByPostalCode = async (postalCode: string): Promise<Location[]> => {
  if (!postalCode || postalCode.length < 4) return [];

  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom,code,codesPostaux,codeDepartement,codeRegion,population,centre&format=json&geometry=centre`
    );

    if (!response.ok) {
      throw new Error('Erreur API');
    }

    const cities: GeoApiCity[] = await response.json();
    const locations: Location[] = [];
    
    for (const city of cities) {
      const departmentName = await getDepartmentName(city.codeDepartement);
      const regionName = await getRegionName(city.codeRegion);
      
      // Filtrer pour ne garder que le code postal recherché
      const matchingPostalCodes = city.codesPostaux.filter(cp => cp.startsWith(postalCode));
      
      for (const cp of matchingPostalCodes) {
        locations.push({
          name: city.nom,
          postalCode: cp,
          department: departmentName,
          region: regionName,
          coordinates: {
            lat: city.centre.coordinates[1],
            lng: city.centre.coordinates[0]
          }
        });
      }
    }

    return locations;
  } catch (error) {
    console.error('Erreur lors de la recherche par code postal:', error);
    return [];
  }
};

// Fonction pour vider le cache (utile pour les tests ou le rafraîchissement)
export const clearLocationCache = () => {
  cache.clear();
  departmentCache.clear();
  regionCache.clear();
};