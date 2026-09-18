// Modifiez ici les tarifs, le stock de démonstration et le contact.
window.CAMP_CONFIG = {
  whatsapp: '', // Numéro international, uniquement des chiffres, sans +.
  plans: {
    solo: { name: 'Solo Camp', price: 7500, capacity: 1, stock: 8, description: 'Votre petit refuge, rien qu’à vous.', features: ['Tente individuelle installée', 'Natte inclus', 'Accès aux espaces communs'] },
    duo: { name: 'Duo Camp', price: 12000, capacity: 2, stock: 12, description: 'Les meilleurs souvenirs se partagent.', features: ['Tente pour deux personnes', 'Nattes & éclairage', 'Accès aux espaces communs'] },
    comfort: { name: 'Comfort Camp', price: 17500, capacity: 2, stock: 4, description: 'L’esprit camping, un peu plus douillet.', features: ['Tente premium pour deux', 'Nattes, oreillers & éclairage', 'Accès aux espaces communs'] }
  },
  options: [
    { id: 'breakfast', name: 'Petit-déjeuner', price: 2000, basis: 'person-night', label: '/ personne / nuit' },
    { id: 'linen', name: 'Kit de linge', price: 1500, basis: 'person-stay', label: '/ personne / séjour' },
    { id: 'locker', name: 'Consigne à bagages', price: 1000, basis: 'stay', label: '/ séjour' }
  ]
};
