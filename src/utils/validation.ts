// Utilitaires de validation
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: 'Email requis' };
  }
  
  // Regex plus stricte pour valider le format email complet
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  const isValid = emailRegex.test(email);
  
  if (!isValid) {
    return { isValid: false, message: 'Format d\'email invalide' };
  }
  
  // Vérifier que l'email contient bien un @ et au moins un point dans le domaine
  const parts = email.split('@');
  if (parts.length !== 2) {
    return { isValid: false, message: 'Format d\'email invalide' };
  }
  
  const [localPart, domain] = parts;
  
  // Vérifier que le domaine contient au moins un point
  if (!domain.includes('.')) {
    return { isValid: false, message: 'Domaine invalide - extension manquante' };
  }
  
  // Vérifier que l'extension du domaine fait au moins 2 caractères
  const domainParts = domain.split('.');
  const extension = domainParts[domainParts.length - 1];
  if (extension.length < 2) {
    return { isValid: false, message: 'Extension de domaine trop courte' };
  }
  
  // Vérifications supplémentaires
  if (email.length > 254) {
    return { isValid: false, message: 'Email trop long' };
  }
  
  if (localPart.length > 64) {
    return { isValid: false, message: 'Partie locale trop longue' };
  }
  
  // Vérifications supplémentaires pour la sécurité
  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return { isValid: false, message: 'Format de la partie locale invalide' };
  }
  
  // Vérifier que le domaine ne commence pas ou ne finit pas par un point ou un tiret
  if (domain.startsWith('.') || domain.endsWith('.') || domain.startsWith('-') || domain.endsWith('-')) {
    return { isValid: false, message: 'Format de domaine invalide' };
  }
  
  return { isValid: true };
};

export const formatPhoneNumber = (phone: string, countryCode: string): string => {
  // Nettoyer le numéro (enlever espaces, tirets, etc.)
  const cleaned = phone.replace(/\D/g, '');
  
  switch (countryCode) {
    case '+33': // France
      if (cleaned.startsWith('33')) {
        return `+33 ${cleaned.slice(2).replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}`;
      } else if (cleaned.startsWith('0')) {
        return `+33 ${cleaned.slice(1).replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}`;
      } else if (cleaned.length === 9) {
        return `+33 ${cleaned.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}`;
      }
      break;
    case '+32': // Belgique
      return `+32 ${cleaned.replace(/(\d{1})(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}`;
    case '+41': // Suisse
      return `+41 ${cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')}`;
    case '+1': // USA/Canada
      return `+1 ${cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}`;
    default:
      return `${countryCode} ${cleaned}`;
  }
  
  return phone;
};

export const validatePhoneNumber = (phone: string, countryCode: string): { isValid: boolean; message?: string } => {
  if (!phone) {
    return { isValid: false, message: 'Numéro de téléphone requis' };
  }
  
  const cleaned = phone.replace(/\D/g, '');
  
  switch (countryCode) {
    case '+33': // France
      if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return { isValid: true };
      } else if (cleaned.length === 9) {
        return { isValid: true };
      } else if (cleaned.length === 12 && cleaned.startsWith('33')) {
        return { isValid: true };
      }
      return { isValid: false, message: 'Numéro français invalide (10 chiffres attendus)' };
    
    case '+32': // Belgique
      if (cleaned.length === 9 || cleaned.length === 10) {
        return { isValid: true };
      }
      return { isValid: false, message: 'Numéro belge invalide' };
    
    case '+41': // Suisse
      if (cleaned.length === 9) {
        return { isValid: true };
      }
      return { isValid: false, message: 'Numéro suisse invalide' };
    
    case '+1': // USA/Canada
      if (cleaned.length === 10) {
        return { isValid: true };
      }
      return { isValid: false, message: 'Numéro nord-américain invalide' };
    
    default:
      if (cleaned.length >= 7 && cleaned.length <= 15) {
        return { isValid: true };
      }
      return { isValid: false, message: 'Numéro de téléphone invalide' };
  }
};