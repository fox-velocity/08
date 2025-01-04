// api/searchStocks.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).send('Missing query parameter');
  }

  try {
      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}^`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
      console.error("Failed to fetch search data:", error);
    res.status(500).send('Error fetching data');
  }
};