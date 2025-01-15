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
window.addEventListener('load', async function() {
    console.log("load");
   
});

    window.addEventListener('load', async function() {
      console.log("load");
    });
    window.addEventListener('DOMContentLoaded', async function() {
         console.log("DOMContentLoaded");
         const searchInput = document.getElementById('searchInput');
          try {
               searchInput.addEventListener('input', async function () {
                   console.log("écouteur d'évènement")
               });
            } catch (error) {
               console.error("Erreur lors de l'execution du code: ", error);
            }
     });
