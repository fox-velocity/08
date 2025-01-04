// api/searchStocks.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}^`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text(); // Obtenir le contenu text de l'erreur
      console.error(`HTTP error! Status: ${response.status}, Message: ${errorText}`); // Log l'erreur dans Vercel

      return res.status(response.status).json({ error: `Failed to fetch search data: ${errorText}` }); //Envoyer une erreur json au client
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
      console.error("Failed to fetch search data:", error);
    res.status(500).json({ error: 'Error fetching data' });
  }
};