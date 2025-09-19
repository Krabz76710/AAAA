// Base de données des pays avec indicatifs téléphoniques
export interface Country {
  code: string; // Code ISO (FR, BE, etc.)
  name: string;
  dialCode: string; // +33, +32, etc.
  flag: string; // Emoji du drapeau
  format?: string; // Format d'affichage du numéro
}

export const countries: Country[] = [
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    flag: '🇫🇷',
    format: '+33 X XX XX XX XX'
  },
  {
    code: 'BE',
    name: 'Belgique',
    dialCode: '+32',
    flag: '🇧🇪',
    format: '+32 X XXX XX XX XX'
  },
  {
    code: 'CH',
    name: 'Suisse',
    dialCode: '+41',
    flag: '🇨🇭',
    format: '+41 XX XXX XX XX'
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    flag: '🇨🇦',
    format: '+1 XXX XXX XXXX'
  },
  {
    code: 'US',
    name: 'États-Unis',
    dialCode: '+1',
    flag: '🇺🇸',
    format: '+1 XXX XXX XXXX'
  },
  {
    code: 'GB',
    name: 'Royaume-Uni',
    dialCode: '+44',
    flag: '🇬🇧',
    format: '+44 XXXX XXXXXX'
  },
  {
    code: 'DE',
    name: 'Allemagne',
    dialCode: '+49',
    flag: '🇩🇪',
    format: '+49 XXX XXXXXXX'
  },
  {
    code: 'IT',
    name: 'Italie',
    dialCode: '+39',
    flag: '🇮🇹',
    format: '+39 XXX XXX XXXX'
  },
  {
    code: 'ES',
    name: 'Espagne',
    dialCode: '+34',
    flag: '🇪🇸',
    format: '+34 XXX XXX XXX'
  },
  {
    code: 'PT',
    name: 'Portugal',
    dialCode: '+351',
    flag: '🇵🇹',
    format: '+351 XXX XXX XXX'
  },
  {
    code: 'NL',
    name: 'Pays-Bas',
    dialCode: '+31',
    flag: '🇳🇱',
    format: '+31 X XXXX XXXX'
  },
  {
    code: 'LU',
    name: 'Luxembourg',
    dialCode: '+352',
    flag: '🇱🇺',
    format: '+352 XXX XXX XXX'
  },
  {
    code: 'MC',
    name: 'Monaco',
    dialCode: '+377',
    flag: '🇲🇨',
    format: '+377 XX XX XX XX'
  }
];

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return countries.find(country => country.dialCode === dialCode);
};

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};