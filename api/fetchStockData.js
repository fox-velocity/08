// api/fetchStockData.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { symbol, startDate, endDate } = req.query;

    if (!symbol || !startDate || !endDate) {
        return res.status(400).send('Missing parameters');
    }
    const startDateUnix = new Date(startDate).getTime() / 1000;
    const endDateUnix = new Date(endDate).getTime() / 1000;

    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDateUnix}&period2=${endDateUnix}&interval=1mo`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
         res.status(200).json(data);
    } catch (error) {
         console.error("Failed to fetch stock data:", error);
        res.status(500).send('Error fetching data');
    }
};