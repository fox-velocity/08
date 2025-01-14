// api.js

const apiBaseUrl = 'https://api.allorigins.win/get?url='; // URL de base pour l'API Allorigins

// Fonction pour effectuer un appel à l'API Yahoo Finance
export async function fetchYahooData(url) {
    try {
        const fullUrl = `${apiBaseUrl}${encodeURIComponent(url)}`;
        const response = await fetch(fullUrl);
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return JSON.parse(data.contents);
    } catch (error) {
        console.error('Erreur lors de la requête API:', error);
        throw error;
    }
}