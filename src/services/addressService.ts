// Service pour l'autocomplétion d'adresses françaises
import { Location } from '../data/locations';

export interface Address {
  id: string;
  label: string; // Adresse complète formatée
  name: string; // Nom de la rue
  housenumber?: string; // Numéro
  street: string; // Rue complète avec numéro
  postcode: string;
  city: string;
  citycode: string;
  context: string; // Département, région
  type: 'housenumber' | 'street' | 'locality' | 'municipality';
  importance: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface DetailedAddress {
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

// Cache pour éviter les appels répétés
const addressCache = new Map<string, Address[]>();

// Fonction de recherche d'adresses via l'API officielle française
export const searchFrenchAddresses = async (query: string, limit: number = 8): Promise<Address[]> => {
  if (!query || query.length < 3) return [];

  const cacheKey = `${query.toLowerCase()}-${limit}`;
  if (addressCache.has(cacheKey)) {
    return addressCache.get(cacheKey)!;
  }

  try {
    // Utilisation de l'API adresse.data.gouv.fr (Base Adresse Nationale)
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=${limit}&autocomplete=1`
    );

    if (!response.ok) {
      throw new Error('Erreur API adresse');
    }

    const data = await response.json();
    
    // Conversion vers notre format
    const addresses: Address[] = data.features.map((feature: any) => ({
      id: feature.properties.id,
      label: feature.properties.label,
      name: feature.properties.name || '',
      housenumber: feature.properties.housenumber,
      street: feature.properties.housenumber 
        ? `${feature.properties.housenumber} ${feature.properties.name || feature.properties.street || ''}`
        : feature.properties.name || feature.properties.street || '',
      postcode: feature.properties.postcode,
      city: feature.properties.city,
      citycode: feature.properties.citycode,
      context: feature.properties.context,
      type: feature.properties.type,
      importance: feature.properties.importance || 0,
      coordinates: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      }
    }));

    // Tri par importance et type (numéros d'abord, puis rues)
    addresses.sort((a, b) => {
      if (a.type !== b.type) {
        const typeOrder = { housenumber: 0, street: 1, locality: 2, municipality: 3 };
        return typeOrder[a.type] - typeOrder[b.type];
      }
      return b.importance - a.importance;
    });

    // Mise en cache
    addressCache.set(cacheKey, addresses);
    
    return addresses;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'adresses:', error);
    return [];
  }
};

// Fonction pour rechercher par code postal
export const searchAddressByPostalCode = async (postalCode: string): Promise<Address[]> => {
  if (!postalCode || postalCode.length < 4) return [];

  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?postcode=${postalCode}&type=municipality&limit=10`
    );

    if (!response.ok) {
      throw new Error('Erreur API adresse');
    }

    const data = await response.json();
    
    return data.features.map((feature: any) => ({
      id: feature.properties.id,
      label: feature.properties.label,
      name: feature.properties.name || '',
      street: feature.properties.name || '',
      postcode: feature.properties.postcode,
      city: feature.properties.city,
      citycode: feature.properties.citycode,
      context: feature.properties.context,
      type: feature.properties.type,
      importance: feature.properties.importance || 0,
      coordinates: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      }
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche par code postal:', error);
    return [];
  }
};

// Fonction pour vider le cache
export const clearAddressCache = () => {
  addressCache.clear();
};