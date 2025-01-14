// utils.js

// Fonction pour formater un nombre avec des espaces tous les trois chiffres
export function formatNumber(number) {
    return String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  
  // Fonction pour formater les nombres dans les champs de saisie
  export function formatNumberInput(input) {
    let value = input.value.replace(/\D/g, ''); // Supprime tout caractère non numérique
      // Limiter à 16 chiffres pour éviter les problèmes de performances et de saisie
      if (value.length > 16) {
          value = value.slice(0, 16);
      }
      input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Ajoute des espaces
  }
  
  //Fonction pour attendre un certain temps 
  export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }