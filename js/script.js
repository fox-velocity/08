// script.js
import { fetchYahooData } from './modules/api.js';
import { updateEvolutionChart, updateInvestmentChart, updateSavingsChart } from './modules/charts.js';
import { calculateInvestmentData } from './modules/data.js';
import { updateStockInfo, updateResultsDisplay, updateSecuredGainsTable, displaySuggestions, showLoadingIndicator, setElementVisibility } from './modules/dom.js';
//import { generateExcelFile } from './modules/excel.js';
import { generatePDF } from './modules/pdf.js';
import { initializeTheme, toggleTheme } from './modules/theme.js';
import { formatNumberInput } from './modules/utils.js';
import { currencySymbols, exchangeToCurrency } from './modules/constants.js';

let selectedSymbol = "";
let currencySymbol = "";
let excelData = null;
let excelCappedDatesAndAmounts = null;
let pdfMake = null;
let logoBase64 = null;

// Fonction pour basculer l'affichage de la section avancée
function toggleSection() {
    var section = document.getElementById("advancedSection");
    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

// Initialisation au chargement de la page
window.onload = async function () {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    document.getElementById('startDate').value = lastYear.toISOString().split('T')[0];
    initializeTheme();
    //pdfMake
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.min.js';
    document.head.appendChild(script2);

    // Attendre que pdfMake soit chargé
    await new Promise(resolve => {
        script2.onload = () => {
            pdfMake = window.pdfMake;
            console.log("pdfMake is ready :", pdfMake)
            resolve();
         };
    });
     fetch('./logoBase64.js')
      .then(response => response.text())
         .then(data => {
         logoBase64 = data;
           console.log('logoBase64:', logoBase64);
        })
     .catch(error => console.error('Error loading logo:', error));

     const downloadPdfButton = document.getElementById('download-pdf');
       downloadPdfButton.addEventListener('click',  generatePDFWrapper);
};

// Gestion des changements de date
document.getElementById('startDate').addEventListener('change', function () {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    if (endDate <= startDate) {
        endDateInput.value = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1).toISOString().split('T')[0];
    }
});

document.getElementById('endDate').addEventListener('change', function () {
    const endDateInput = document.getElementById('endDate');
    const startDateInput = document.getElementById('startDate');
    const endDate = new Date(endDateInput.value);
    const startDate = new Date(startDateInput.value);
    if (startDate >= endDate) {
        startDateInput.value = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1).toISOString().split('T')[0];
    }
});


// Recherche de symboles
document.getElementById('searchInput').addEventListener('input', async function () {
    const query = this.value.trim();
    if (!query) {
         setElementVisibility('suggestions', false);
         setElementVisibility('results', false);
         setElementVisibility('resultsWithCapping', false);
        return;
    }
     setElementVisibility('results', false);
     setElementVisibility('resultsWithCapping', false);
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = "Chargement...";
    setElementVisibility('suggestions', true);
    try {
          const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}^`;
         const yahooData = await fetchYahooData(url);
          const results = yahooData.quotes;
           displaySuggestions(results);
    } catch (error) {
        console.error("Erreur lors de la recherche : ", error);
        suggestionsContainer.innerHTML = "Erreur lors de la recherche.";
    } finally {
        if (query) {
            setElementVisibility('evolutionChartContainer', true);
            setElementVisibility('investmentChartContainer', true);
            setElementVisibility('results', true);
            setElementVisibility('resultsWithCapping', true);
             setElementVisibility('savingsChartContainer', true);
        }
    }
});

// Sélection d'un symbole
function selectSymbol(symbol, name, exchange, type, sector, industry) {
    selectedSymbol = symbol;
    document.getElementById('searchInput').value = symbol;
    setElementVisibility('suggestions', false);
    setElementVisibility('ModeEmploie', false);
    setElementVisibility('evolutionChartContainer', true);
    setElementVisibility('investmentChartContainer', true);
    setElementVisibility('download-button', true);
    setElementVisibility('results', true);
     setElementVisibility('resultsWithCapping', true);
    const currency = exchangeToCurrency[exchange] || 'N/A';
    currencySymbol = currencySymbols[currency] || currency;
    updateStockInfo(name, symbol, exchange, currencySymbol, type, industry);
    fetchData();
}
window.selectSymbol = selectSymbol; // Rend selectSymbol accessible globalement

// Récupération des données
async function fetchData() {
    if (!selectedSymbol) {
        alert("Veuillez rechercher et sélectionner une valeur avant de continuer.");
        return;
    }
    showLoadingIndicator(true);
    const startDateInput = new Date(document.getElementById('startDate').value);
    const endDateInput = new Date(document.getElementById('endDate').value);
    const startDate = startDateInput.getTime() / 1000;
    const endDate = endDateInput.getTime() / 1000;
     // Récupérer la valeur numérique (sans espace) des champs de saisie
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value.replace(/\s/g, '')) || 0;
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value.replace(/\s/g, '')) || 0;
    // Récupérer le pourcentage d'écrêtage depuis le select
    const cappingPercentage = parseFloat(document.getElementById('cappingPercentage').value) || 0.05;
    // Récupérer le montant minimum d'écrêtage depuis le select
    const minCappingAmount = parseFloat(document.getElementById('minCappingAmount').value) || 100;
    // Récupérer le taux d'intérêt annuel
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value) || 0.02;
    const monthlyInterestRate = Math.pow(1 + (annualInterestRate), 1 / 12) - 1;
    try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${selectedSymbol}?period1=${startDate}&period2=${endDate}&interval=1mo`;
          const yahooData = await fetchYahooData(url);
        console.log('API Response:', yahooData); // Log the API response for debugging
        if (!yahooData.chart || !yahooData.chart.result) {
            alert('Aucune donnée disponible pour cet indice.');
            return;
        }
        const result = yahooData.chart.result[0];
        const timestamps = result.timestamp;
        const prices = result.indicators.quote[0].close;
        const { chartData, cappedDatesAndAmountsWithInterest, results } = calculateInvestmentData(timestamps, prices, initialInvestment, monthlyInvestment, cappingPercentage, minCappingAmount, monthlyInterestRate);
          updateResultsDisplay(results, currencySymbol);
           updateSecuredGainsTable(cappedDatesAndAmountsWithInterest, currencySymbol)
             updateEvolutionChart(chartData.labels, chartData.prices);
             updateInvestmentChart(chartData.labels, chartData.investments, chartData.portfolio, chartData.portfolioValueEcreteAvecGain);
          updateSavingsChart(chartData.labels, chartData.investments, chartData.portfolio,monthlyInterestRate);
         // Stocker les données pour le fichier excel
         excelData = chartData;
        excelCappedDatesAndAmounts = cappedDatesAndAmountsWithInterest;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        alert('Erreur lors de la récupération des données. Veuillez réessayer.');
    } finally {
        showLoadingIndicator(false);
    }
}
// Gestion du téléchargement Excel
function downloadExcel() {
    if (excelData && excelCappedDatesAndAmounts) {
        generateExcelFile(excelData, excelCappedDatesAndAmounts, currencySymbol);
    } else {
        alert("Aucune donnée à exporter, veuillez faire une simulation.");
    }
}
// Gestion du changement de thème
document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

// Gestion du formatage des inputs
document.getElementById('initialInvestment').addEventListener('input', function () {
    formatNumberInput(this);
});
document.getElementById('monthlyInvestment').addEventListener('input', function () {
    formatNumberInput(this);
});

// Gestion du téléchargement PDF
async function generatePDFWrapper() {
    if(!pdfMake){
        alert("pdfMake n'est pas disponible, veuillez recharger la page")
         return;
    }
      try {
          await generatePDF(pdfMake, logoBase64);
       } catch (error) {
         console.error('Erreur lors de la génération du PDF', error);
     }
}
window.generatePDFWrapper = generatePDFWrapper; //Laisse l'exposition globale
document.getElementById('download-pdf').addEventListener('click', generatePDFWrapper);

// Rendre generatePDFWrapper accessible globalement
window.generatePDFWrapper = generatePDFWrapper;

// Exporter les fonctions nécessaires pour les tests
export {toggleSection, selectSymbol, fetchData, downloadExcel, toggleTheme};
