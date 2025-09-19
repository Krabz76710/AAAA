// Base de données des villes françaises avec codes postaux
export interface Location {
  name: string;
  postalCode: string;
  department: string;
  region: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const frenchCities: Location[] = [
  // Grandes villes
  { name: "Paris", postalCode: "75001", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75002", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75003", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75004", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75005", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75006", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75007", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75008", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75009", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75010", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75011", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75012", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75013", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75014", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75015", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75016", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75017", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75018", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75019", department: "Paris", region: "Île-de-France" },
  { name: "Paris", postalCode: "75020", department: "Paris", region: "Île-de-France" },
  
  { name: "Marseille", postalCode: "13001", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13002", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13003", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13004", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13005", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13006", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13007", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13008", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13009", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13010", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13011", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13012", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13013", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13014", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13015", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Marseille", postalCode: "13016", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  
  { name: "Lyon", postalCode: "69001", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { name: "Lyon", postalCode: "69002", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { name: "Lyon", postalCode: "69003", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { name: "Lyon", postalCode: "69004", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { name: "Lyon", postalCode: "69005", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { name: "Lyon", postalCode: "69006", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { name: "Lyon", postalCode: "69007", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { name: "Lyon", postalCode: "69008", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  { name: "Lyon", postalCode: "69009", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  
  { name: "Toulouse", postalCode: "31000", department: "Haute-Garonne", region: "Occitanie" },
  { name: "Toulouse", postalCode: "31100", department: "Haute-Garonne", region: "Occitanie" },
  { name: "Toulouse", postalCode: "31200", department: "Haute-Garonne", region: "Occitanie" },
  { name: "Toulouse", postalCode: "31300", department: "Haute-Garonne", region: "Occitanie" },
  { name: "Toulouse", postalCode: "31400", department: "Haute-Garonne", region: "Occitanie" },
  { name: "Toulouse", postalCode: "31500", department: "Haute-Garonne", region: "Occitanie" },
  
  { name: "Nice", postalCode: "06000", department: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Nice", postalCode: "06100", department: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Nice", postalCode: "06200", department: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Nice", postalCode: "06300", department: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur" },
  
  { name: "Nantes", postalCode: "44000", department: "Loire-Atlantique", region: "Pays de la Loire" },
  { name: "Nantes", postalCode: "44100", department: "Loire-Atlantique", region: "Pays de la Loire" },
  { name: "Nantes", postalCode: "44200", department: "Loire-Atlantique", region: "Pays de la Loire" },
  { name: "Nantes", postalCode: "44300", department: "Loire-Atlantique", region: "Pays de la Loire" },
  
  { name: "Montpellier", postalCode: "34000", department: "Hérault", region: "Occitanie" },
  { name: "Montpellier", postalCode: "34070", department: "Hérault", region: "Occitanie" },
  { name: "Montpellier", postalCode: "34080", department: "Hérault", region: "Occitanie" },
  { name: "Montpellier", postalCode: "34090", department: "Hérault", region: "Occitanie" },
  
  { name: "Strasbourg", postalCode: "67000", department: "Bas-Rhin", region: "Grand Est" },
  { name: "Strasbourg", postalCode: "67100", department: "Bas-Rhin", region: "Grand Est" },
  { name: "Strasbourg", postalCode: "67200", department: "Bas-Rhin", region: "Grand Est" },
  
  { name: "Bordeaux", postalCode: "33000", department: "Gironde", region: "Nouvelle-Aquitaine" },
  { name: "Bordeaux", postalCode: "33100", department: "Gironde", region: "Nouvelle-Aquitaine" },
  { name: "Bordeaux", postalCode: "33200", department: "Gironde", region: "Nouvelle-Aquitaine" },
  { name: "Bordeaux", postalCode: "33300", department: "Gironde", region: "Nouvelle-Aquitaine" },
  { name: "Bordeaux", postalCode: "33800", department: "Gironde", region: "Nouvelle-Aquitaine" },
  
  { name: "Lille", postalCode: "59000", department: "Nord", region: "Hauts-de-France" },
  { name: "Lille", postalCode: "59160", department: "Nord", region: "Hauts-de-France" },
  { name: "Lille", postalCode: "59260", department: "Nord", region: "Hauts-de-France" },
  { name: "Lille", postalCode: "59777", department: "Nord", region: "Hauts-de-France" },
  { name: "Lille", postalCode: "59800", department: "Nord", region: "Hauts-de-France" },
  
  { name: "Rennes", postalCode: "35000", department: "Ille-et-Vilaine", region: "Bretagne" },
  { name: "Rennes", postalCode: "35200", department: "Ille-et-Vilaine", region: "Bretagne" },
  { name: "Rennes", postalCode: "35700", department: "Ille-et-Vilaine", region: "Bretagne" },
  
  { name: "Reims", postalCode: "51100", department: "Marne", region: "Grand Est" },
  { name: "Reims", postalCode: "51430", department: "Marne", region: "Grand Est" },
  { name: "Reims", postalCode: "51450", department: "Marne", region: "Grand Est" },
  { name: "Reims", postalCode: "51500", department: "Marne", region: "Grand Est" },
  
  { name: "Saint-Étienne", postalCode: "42000", department: "Loire", region: "Auvergne-Rhône-Alpes" },
  { name: "Saint-Étienne", postalCode: "42100", department: "Loire", region: "Auvergne-Rhône-Alpes" },
  
  { name: "Toulon", postalCode: "83000", department: "Var", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Toulon", postalCode: "83100", department: "Var", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Toulon", postalCode: "83200", department: "Var", region: "Provence-Alpes-Côte d'Azur" },
  
  { name: "Grenoble", postalCode: "38000", department: "Isère", region: "Auvergne-Rhône-Alpes" },
  { name: "Grenoble", postalCode: "38100", department: "Isère", region: "Auvergne-Rhône-Alpes" },
  
  { name: "Dijon", postalCode: "21000", department: "Côte-d'Or", region: "Bourgogne-Franche-Comté" },
  
  { name: "Angers", postalCode: "49000", department: "Maine-et-Loire", region: "Pays de la Loire" },
  { name: "Angers", postalCode: "49100", department: "Maine-et-Loire", region: "Pays de la Loire" },
  
  { name: "Nîmes", postalCode: "30000", department: "Gard", region: "Occitanie" },
  { name: "Nîmes", postalCode: "30900", department: "Gard", region: "Occitanie" },
  
  { name: "Villeurbanne", postalCode: "69100", department: "Rhône", region: "Auvergne-Rhône-Alpes" },
  
  { name: "Le Mans", postalCode: "72000", department: "Sarthe", region: "Pays de la Loire" },
  { name: "Le Mans", postalCode: "72100", department: "Sarthe", region: "Pays de la Loire" },
  
  { name: "Aix-en-Provence", postalCode: "13090", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Aix-en-Provence", postalCode: "13100", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Aix-en-Provence", postalCode: "13290", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Aix-en-Provence", postalCode: "13540", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  
  { name: "Brest", postalCode: "29200", department: "Finistère", region: "Bretagne" },
  
  { name: "Tours", postalCode: "37000", department: "Indre-et-Loire", region: "Centre-Val de Loire" },
  { name: "Tours", postalCode: "37100", department: "Indre-et-Loire", region: "Centre-Val de Loire" },
  { name: "Tours", postalCode: "37200", department: "Indre-et-Loire", region: "Centre-Val de Loire" },
  
  { name: "Amiens", postalCode: "80000", department: "Somme", region: "Hauts-de-France" },
  { name: "Amiens", postalCode: "80090", department: "Somme", region: "Hauts-de-France" },
  
  { name: "Limoges", postalCode: "87000", department: "Haute-Vienne", region: "Nouvelle-Aquitaine" },
  { name: "Limoges", postalCode: "87100", department: "Haute-Vienne", region: "Nouvelle-Aquitaine" },
  
  { name: "Annecy", postalCode: "74000", department: "Haute-Savoie", region: "Auvergne-Rhône-Alpes" },
  
  { name: "Perpignan", postalCode: "66000", department: "Pyrénées-Orientales", region: "Occitanie" },
  { name: "Perpignan", postalCode: "66100", department: "Pyrénées-Orientales", region: "Occitanie" },
  
  { name: "Besançon", postalCode: "25000", department: "Doubs", region: "Bourgogne-Franche-Comté" },
  
  { name: "Orléans", postalCode: "45000", department: "Loiret", region: "Centre-Val de Loire" },
  { name: "Orléans", postalCode: "45100", department: "Loiret", region: "Centre-Val de Loire" },
  
  { name: "Metz", postalCode: "57000", department: "Moselle", region: "Grand Est" },
  { name: "Metz", postalCode: "57070", department: "Moselle", region: "Grand Est" },
  
  { name: "Rouen", postalCode: "76000", department: "Seine-Maritime", region: "Normandie" },
  { name: "Rouen", postalCode: "76100", department: "Seine-Maritime", region: "Normandie" },
  
  { name: "Mulhouse", postalCode: "68100", department: "Haut-Rhin", region: "Grand Est" },
  { name: "Mulhouse", postalCode: "68200", department: "Haut-Rhin", region: "Grand Est" },
  
  { name: "Caen", postalCode: "14000", department: "Calvados", region: "Normandie" },
  
  { name: "Nancy", postalCode: "54000", department: "Meurthe-et-Moselle", region: "Grand Est" },
  { name: "Nancy", postalCode: "54100", department: "Meurthe-et-Moselle", region: "Grand Est" },
  
  // Villes moyennes importantes
  { name: "Avignon", postalCode: "84000", department: "Vaucluse", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Cannes", postalCode: "06400", department: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Antibes", postalCode: "06600", department: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Versailles", postalCode: "78000", department: "Yvelines", region: "Île-de-France" },
  { name: "Boulogne-Billancourt", postalCode: "92100", department: "Hauts-de-Seine", region: "Île-de-France" },
  { name: "Nanterre", postalCode: "92000", department: "Hauts-de-Seine", region: "Île-de-France" },
  { name: "Créteil", postalCode: "94000", department: "Val-de-Marne", region: "Île-de-France" },
  { name: "Argenteuil", postalCode: "95100", department: "Val-d'Oise", region: "Île-de-France" },
  { name: "Montreuil", postalCode: "93100", department: "Seine-Saint-Denis", region: "Île-de-France" },
  { name: "Saint-Denis", postalCode: "93200", department: "Seine-Saint-Denis", region: "Île-de-France" },
  
  // Villes du spectacle et de l'événementiel
  { name: "Cannes", postalCode: "06150", department: "Alpes-Maritimes", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Deauville", postalCode: "14800", department: "Calvados", region: "Normandie" },
  { name: "Angoulême", postalCode: "16000", department: "Charente", region: "Nouvelle-Aquitaine" },
  { name: "Arles", postalCode: "13200", department: "Bouches-du-Rhône", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Bourges", postalCode: "18000", department: "Cher", region: "Centre-Val de Loire" },
  { name: "Clermont-Ferrand", postalCode: "63000", department: "Puy-de-Dôme", region: "Auvergne-Rhône-Alpes" },
  { name: "La Rochelle", postalCode: "17000", department: "Charente-Maritime", region: "Nouvelle-Aquitaine" },
  { name: "Poitiers", postalCode: "86000", department: "Vienne", region: "Nouvelle-Aquitaine" },
  { name: "Pau", postalCode: "64000", department: "Pyrénées-Atlantiques", region: "Nouvelle-Aquitaine" },
  { name: "Bayonne", postalCode: "64100", department: "Pyrénées-Atlantiques", region: "Nouvelle-Aquitaine" },
  { name: "Biarritz", postalCode: "64200", department: "Pyrénées-Atlantiques", region: "Nouvelle-Aquitaine" },
  { name: "Chamonix-Mont-Blanc", postalCode: "74400", department: "Haute-Savoie", region: "Auvergne-Rhône-Alpes" },
  { name: "Courchevel", postalCode: "73120", department: "Savoie", region: "Auvergne-Rhône-Alpes" },
  { name: "Val d'Isère", postalCode: "73150", department: "Savoie", region: "Auvergne-Rhône-Alpes" },
  { name: "Méribel", postalCode: "73550", department: "Savoie", region: "Auvergne-Rhône-Alpes" },
  { name: "Saint-Tropez", postalCode: "83990", department: "Var", region: "Provence-Alpes-Côte d'Azur" },
  { name: "Monaco", postalCode: "98000", department: "Monaco", region: "Monaco" },
];

// Fonction de recherche avec fuzzy matching
export const searchLocations = (query: string, limit: number = 10): Location[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Recherche exacte d'abord
  const exactMatches = frenchCities.filter(city => 
    city.name.toLowerCase().startsWith(normalizedQuery) ||
    city.postalCode.startsWith(normalizedQuery)
  );
  
  // Recherche partielle
  const partialMatches = frenchCities.filter(city => 
    !exactMatches.includes(city) && (
      city.name.toLowerCase().includes(normalizedQuery) ||
      city.department.toLowerCase().includes(normalizedQuery) ||
      city.region.toLowerCase().includes(normalizedQuery)
    )
  );
  
  // Combiner et limiter les résultats
  return [...exactMatches, ...partialMatches].slice(0, limit);
};

// Fonction pour obtenir les informations d'une ville par code postal
export const getLocationByPostalCode = (postalCode: string): Location | null => {
  return frenchCities.find(city => city.postalCode === postalCode) || null;
};

// Fonction pour obtenir les informations d'une ville par nom
export const getLocationByName = (name: string): Location[] => {
  return frenchCities.filter(city => 
    city.name.toLowerCase() === name.toLowerCase()
  );
};