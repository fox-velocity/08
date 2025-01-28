// script.js
import { fetchYahooData } from './modules/api.js';
import { updateEvolutionChart, updateInvestmentChart, updateSavingsChart } from './modules/charts.js';
import { calculateInvestmentData } from './modules/data.js';
import { updateStockInfo, updateResultsDisplay, updateSecuredGainsTable, displaySuggestions, showLoadingIndicator, setElementVisibility } from './modules/dom.js';
import { generateExcelFile } from './modules/excel.js';
import { generatePDF } from './modules/pdf.js';
import { initializeTheme, toggleTheme } from './modules/theme.js';
import { formatNumberInput, formatNumber } from './modules/utils.js';
import { currencySymbols, exchangeToCurrency } from './modules/constants.js';

let selectedSymbol = "";
let currencySymbol = "";
let excelData = null;
let excelCappedDatesAndAmounts = null;
let pdfMake = null;
let logoBase64 = null;
let logoRenardBase64Gris = null; // Ajout de la variable pour l'image de fond
let searchTimeout = null; // Ajouter un timer pour la recherche

// Initialisation au chargement de la page
window.onload = function () {
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
    script2.onload = () => {
        pdfMake = window.pdfMake;
        console.log("pdfMake is ready :", pdfMake)
    };
    fetch('./logoBase64')
        .then(response => response.text())
        .then(data => {
            logoBase64 = data;

        })
        .catch(error => console.error('Error loading logo:', error));

    // Chargement de l'image de fond
    fetch('./logorenard.base64Gris.base64') // Chemin vers ton fichier base64
        .then(response => response.text())
        .then(data => {
            logoRenardBase64Gris =  data;
        })
        .catch(error => console.error('Error loading background image:', error));
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
document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value.trim();
    clearTimeout(searchTimeout); // Annule le timeout précédent s'il existe
    if (query.length < 3) {
        setElementVisibility('suggestions', false);
        setElementVisibility('results', false);
        setElementVisibility('resultsWithCapping', false);
         setElementVisibility('savingsChartContainer', false);
        return; // Ne fait rien si moins de 3 caractères
    }
    searchTimeout = setTimeout(async () => {
        if (!query) {
            setElementVisibility('suggestions', false);
            setElementVisibility('results', false);
            setElementVisibility('resultsWithCapping', false);
             setElementVisibility('savingsChartContainer', false);
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
    }, 300); // Délai de 300 ms
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
     setElementVisibility('savingsChartContainer', true);
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
        const { chartData, cappedDatesAndAmountsWithInterest, results } = calculateInvestmentData(timestamps, prices, initialInvestment, monthlyInvestment, cappingPercentage, minCappingAmount, monthlyInterestRate, annualInterestRate);
        updateResultsDisplay(results, currencySymbol);
        updateSecuredGainsTable(cappedDatesAndAmountsWithInterest, currencySymbol)
        updateEvolutionChart(chartData.labels, chartData.prices);
        updateInvestmentChart(chartData.labels, chartData.investments, chartData.portfolio, chartData.portfolioValueEcreteAvecGain);
          const { totalInterest, finalAmount } = updateSavingsChart(chartData.labels, chartData.investments, chartData.portfolio, monthlyInterestRate);
       document.getElementById('total-interest').textContent = formatNumber(totalInterest.toFixed(2).replace('.', ',')) + currencySymbol;
          document.getElementById('final-amount').textContent = formatNumber(finalAmount.toFixed(2).replace('.', ',')) + currencySymbol;
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
    try {
        await generatePDF(pdfMake, logoBase64, logoRenardBase64Gris); // <-- Ajout de l'image de fond en paramètre
    } catch (error) {
        console.error('Erreur lors de la génération du PDF', error);
    }
}
document.getElementById('download-pdf').addEventListener('click', generatePDFWrapper);

// Rendre generatePDFWrapper accessible globalement
window.generatePDFWrapper = generatePDFWrapper;

// Gestion du bouton écrétage
document.querySelector('.toggle-button').addEventListener('click', function () {
    var section = document.getElementById("advancedSection");
    section.style.display = section.style.display === "none" ? "block" : "none";
    fetchData(); // recalcul des données
});
// Exporter les fonctions nécessaires pour les tests
export { selectSymbol, fetchData, downloadExcel, toggleTheme };
window.fetchData = fetchData;
window.toggleTheme = toggleTheme; //  ajout pour rendre la fonction accesible globalement
// Gestionnaire d'événement pour le bouton de téléchargement Excel
const downloadButton = document.getElementById('download-button');
downloadButton.addEventListener('click', downloadExcel);
