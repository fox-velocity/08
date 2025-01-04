// script.js

// --- Variables Globales ---
let evolutionChart = null;
let investmentChart = null;
let selectedSymbol = "";
let currencySymbol = "";
let excelData = null;
let excelCappedDatesAndAmounts = null;

// --- Initialisation de la page ---
function initializePage() {
    setInitialDateValues();
    setupDateChangeListeners();
}

function setInitialDateValues() {
     const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    // Définir la date de fin comme la fin du mois précédent
    const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    document.getElementById('startDate').value = lastYear.toISOString().split('T')[0];
}

function setupDateChangeListeners() {
    document.getElementById('startDate').addEventListener('change', handleStartDateChange);
    document.getElementById('endDate').addEventListener('change', handleEndDateChange);
}

function handleStartDateChange() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (endDate <= startDate) {
        endDateInput.value = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1).toISOString().split('T')[0];
    }
}

function handleEndDateChange() {
    const endDateInput = document.getElementById('endDate');
    const startDateInput = document.getElementById('startDate');
    const endDate = new Date(endDateInput.value);
    const startDate = new Date(startDateInput.value);

    if (startDate >= endDate) {
        startDateInput.value = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1).toISOString().split('T')[0];
    }
}
// --- Gestion de l'écrêtage ---
function toggleSection() {
    const section = document.getElementById("advancedSection");
    section.style.display = section.style.display === "none" ? "block" : "none";
}

// --- Recherche Dynamique d'Actions ---
document.getElementById('searchInput').addEventListener('input', handleSearchInput);

async function handleSearchInput() {
    const query = this.value.trim();
    resetUIForSearch(query);

    if (!query) return;

    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = "Chargement...";
    suggestionsContainer.style.display = 'block';

    try {
        const results = await fetchStockSuggestions(query);
        displayStockSuggestions(results, suggestionsContainer);

    } catch (error) {
        handleSearchError(error, suggestionsContainer);
    } finally {
        if (query) {
            displayChartsAndResults();
        }
    }
}

function resetUIForSearch(query) {
    if (!query) {
        document.getElementById('suggestions').style.display = 'none';
        document.getElementById('results').style.display = 'none';
        document.getElementById('resultsWithCapping').style.display = 'none';
    } else{
            document.getElementById('results').style.display = 'none';
            document.getElementById('resultsWithCapping').style.display = 'none';
    }

}

async function fetchStockSuggestions(query) {
    const response = await fetch(`/api/searchStocks?query=${query}`);
    const data = await response.json();
    return data.quotes;
}

function displayStockSuggestions(results, suggestionsContainer) {
    if (results && results.length > 0) {
    suggestionsContainer.innerHTML = results.map(result =>
        `<div onclick="selectSymbol('${result.symbol}', '${(result.longname || '').replace(/'/g, "\\'")}', '${(result.exchange || '').replace(/'/g, "\\'")}', '${(result.quoteType || '').replace(/'/g, "\\'")}', '${(result.actor || '').replace(/'/g, "\\'")}', '${(result.industry || '').replace(/'/g, "\\'")}')">
            ${result.shortname || result.symbol} (${result.symbol})
        </div>`
    ).join('');
    } else {
        suggestionsContainer.innerHTML = "Aucun résultat trouvé.";
    }
}

function handleSearchError(error, suggestionsContainer) {
    console.error("Erreur lors de la recherche : ", error);
    suggestionsContainer.innerHTML = "Erreur lors de la recherche.";
}
function displayChartsAndResults(){
    document.getElementById('evolutionChartContainer').style.display = 'block';
    document.getElementById('investmentChartContainer').style.display = 'block';
    document.getElementById('results').style.display = 'block';
    document.getElementById('resultsWithCapping').style.display = 'block';
}
// --- Sélection d'un Symbole d'Action ---
async function selectSymbol(symbol, name, exchange, type, sector, industry) {
    selectedSymbol = symbol;
    document.getElementById('searchInput').value = symbol;
    document.getElementById('suggestions').style.display = 'none';
    document.getElementById('ModeEmploie').style.display = 'none';


    displayChartsAndResults()
     document.getElementById('download-button').style.display = 'block';


    try {
        await fetchAndSetCurrency(exchange);
        updateStockInfo(name, symbol, exchange, type, industry);
         fetchData();
    } catch (error) {
      handleCurrencyError(error);
    }
}
async function fetchAndSetCurrency(exchange) {
    const response = await fetch(`/api/getCurrency?exchange=${exchange}`);
    const data = await response.json();
    currencySymbol = currencySymbols[data.currency] || data.currency;
        document.getElementById('currencySymbolLabel').innerText = currencySymbol;
}

function updateStockInfo(name, symbol, exchange, type, industry) {
    document.getElementById('stockName').innerText = name;
    document.getElementById('stockSymbol').innerText = symbol;
    document.getElementById('stockExchange').innerText = exchange;
    document.getElementById('stockCurrency').innerText = currencySymbol;
    document.getElementById('stockType').innerText = type;
    document.getElementById('stockIndustry').innerText = industry;
    document.getElementById('stockInfo').style.display = 'block';
}
function handleCurrencyError(error){
       console.error("Error fetching currency:", error);
    document.getElementById('stockCurrency').innerText = 'N/A';
    document.getElementById('currencySymbolLabel').innerText = '€';
    currencySymbol = '€'
}
// --- Récupération et Traitement des Données d'Investissement ---
async function fetchData() {
    if (!selectedSymbol) {
        alert("Veuillez rechercher et sélectionner une valeur avant de continuer.");
        return;
    }
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';
   try{
       const data = await fetchStockDataFromAPI();
        if(!data || !data.chart || !data.chart.result){
           alert("Aucune donnée disponible pour cet indice.");
            return
        }
        const chartData = processStockData(data);
        updateUIWithResults(chartData);

       // Stocker les données pour le fichier excel
        excelData = chartData;
         excelCappedDatesAndAmounts = chartData.cappedDatesAndAmountsWithInterest
    }
    catch (error){
        handleFetchDataError(error);
    }
    finally {
         loadingIndicator.style.display = 'none';
    }
}

async function fetchStockDataFromAPI() {
    const startDateInput = new Date(document.getElementById('startDate').value);
    const endDateInput = new Date(document.getElementById('endDate').value);
    const startDate = startDateInput.toISOString().split('T')[0];
    const endDate = endDateInput.toISOString().split('T')[0];
    const response = await fetch(`/api/fetchStockData?symbol=${selectedSymbol}&startDate=${startDate}&endDate=${endDate}`);
    return await response.json();
}


function processStockData(yahooData) {

    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value.replace(/\s/g, '')) || 0;
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value.replace(/\s/g, '')) || 0;
    const cappingPercentage = parseFloat(document.getElementById('cappingPercentage').value) || 0.05;
    const minCappingAmount = parseFloat(document.getElementById('minCappingAmount').value) || 100;
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value) || 0.02;
     const monthlyInterestRate = annualInterestRate / 12;
    const result = yahooData.chart.result[0];
    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;


    let totalInvested = initialInvestment;
    let totalShares = initialInvestment / prices[0];
    let numberOfPayments = initialInvestment > 0 ? 1 : 0;
    let maxLossAmount = 0;
    let maxLossPercentage = 0;
    let maxGainAmount = 0;
    let maxGainPercentage = 0;
    let maxLossDate = '';
    let maxGainDate = '';
    let totalInvestedEcrete = initialInvestment;
    let totalSharesEcrete = initialInvestment / prices[0];
    let totalSharesSoldEcrete = 0;
    let securedGains = 0;
    let securedGainsInterest = 0;
    let cappedDatesAndAmounts = [];
    let cappedDatesAndAmountsWithInterest = [];
    let maxLossAmountEcrete = 0;
    let maxLossPercentageEcrete = 0;
    let maxGainAmountEcrete = 0;
    let maxGainPercentageEcrete = 0;
    let maxLossDateEcrete = '';
    let maxGainDateEcrete = '';

    const chartData = {
        labels: [],
        prices: [],
        investments: [],
        portfolio: [],
        sharesBought: [],
        totalShares: [],
        portfolioValueEcreteSansGain: [],
        totalSharesSoldEcrete: [],
        totalSharesEcrete: [],
        securedGains: [],
        portfolioValueEcrete: [],
        portfolioValueEcreteAvecGain: [],
        securedGainsInterest: [],
        totalInvestedEcreteHistory: [],
        cappedDatesAndAmountsWithInterest: []
    };

    const filteredData = [];
    const firstDays = new Set();
      for (let i = 0; i < timestamps.length; i++) {
            const currentDate = new Date(timestamps[i] * 1000);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const firstDayOfMonth = new Date(year, month, 1);

            if (currentDate.toDateString() === firstDayOfMonth.toDateString()) {
                if (!firstDays.has(firstDayOfMonth.toDateString())) {
                    filteredData.push({ date: currentDate, price: prices[i] });
                    firstDays.add(firstDayOfMonth.toDateString());
                }
            }
        }
      let lastCappedMonth = null;
    filteredData.forEach((data, index) => {
        const dateString = data.date.toISOString().split('T')[0];
        chartData.labels.push(dateString);
        chartData.prices.push(data.price);
        if (index < filteredData.length - 1) {
            totalInvested += monthlyInvestment;
            const sharesBought = monthlyInvestment / data.price;
            totalShares += sharesBought;
            numberOfPayments++;
            chartData.sharesBought.push(sharesBought);
           
            totalInvestedEcrete += monthlyInvestment;
             const sharesBoughtEcrete = monthlyInvestment / data.price;
                totalSharesEcrete += sharesBoughtEcrete;
             const portfolioValueEcreteSansGain = totalSharesEcrete * data.price;
                const gainAmountEcrete = portfolioValueEcreteSansGain - totalInvestedEcrete;
                const gainPercentageEcrete = (gainAmountEcrete / totalInvestedEcrete) * 100;
             if (gainAmountEcrete >= minCappingAmount && gainPercentageEcrete > (cappingPercentage * 100)) {
                    securedGains += gainAmountEcrete;
                    const unitsToSell = gainAmountEcrete / data.price;
                     totalSharesEcrete -= unitsToSell;
                    totalSharesSoldEcrete += unitsToSell;
                     cappedDatesAndAmounts.push({ date: dateString, amount: gainAmountEcrete.toFixed(2) });
                     cappedDatesAndAmountsWithInterest.push({ date: dateString, amount: gainAmountEcrete, interest:0 });
                     lastCappedMonth = dateString;
                }
            if (lastCappedMonth && securedGains > 0) {
                 let interestToAdd = 0
                 cappedDatesAndAmountsWithInterest.forEach(item => {
                    if(item.date < dateString){
                             const dateCapped = new Date(item.date);
                            const dateCurrent = new Date(dateString)
                             const monthDiff = (dateCurrent.getFullYear() - dateCapped.getFullYear()) * 12 + (dateCurrent.getMonth() - dateCapped.getMonth())
                           const interest = item.amount * (Math.pow(1 + monthlyInterestRate, monthDiff) - 1);
                           item.interest = interest
                           interestToAdd += interest;
                       }
                  })
              securedGainsInterest = interestToAdd
             }


            chartData.totalSharesSoldEcrete.push(totalSharesSoldEcrete);
            chartData.totalSharesEcrete.push(totalSharesEcrete);
            chartData.securedGains.push(securedGains);
            chartData.securedGainsInterest.push(securedGainsInterest);
             chartData.portfolioValueEcreteSansGain.push(portfolioValueEcreteSansGain);
            const portfolioValueEcrete = totalSharesEcrete * data.price;
             chartData.portfolioValueEcrete.push(portfolioValueEcrete);
           const portfolioValueEcreteAvecGain = portfolioValueEcrete + securedGains + securedGainsInterest;
            chartData.portfolioValueEcreteAvecGain.push(portfolioValueEcreteAvecGain);
           chartData.totalInvestedEcreteHistory.push(totalInvestedEcrete);
        } else {
            chartData.sharesBought.push(0);
            chartData.totalSharesSoldEcrete.push(totalSharesSoldEcrete);
            chartData.totalSharesEcrete.push(totalSharesEcrete);
            const portfolioValueEcreteSansGain = totalSharesEcrete * data.price;
            chartData.securedGains.push(securedGains);
             chartData.securedGainsInterest.push(securedGainsInterest);
            chartData.portfolioValueEcreteSansGain.push(portfolioValueEcreteSansGain);

                // Calculer portfolioValueEcrete après l'écrêtage
                 const portfolioValueEcrete = totalSharesEcrete * data.price;
                chartData.portfolioValueEcrete.push(portfolioValueEcrete);
                 const portfolioValueEcreteAvecGain = portfolioValueEcrete + securedGains + securedGainsInterest;
                chartData.portfolioValueEcreteAvecGain.push(portfolioValueEcreteAvecGain);
               chartData.totalInvestedEcreteHistory.push(totalInvestedEcrete);
        }

         chartData.totalShares.push(totalShares);
        chartData.investments.push(totalInvested);
        chartData.portfolio.push(totalShares * data.price);

          const currentLossAmount = totalInvested - (totalShares * data.price);
            const currentLossPercentage = (currentLossAmount / totalInvested) * 100;
            const currentGainAmount = (totalShares * data.price) - totalInvested;
            const currentGainPercentage = (currentGainAmount / totalInvested) * 100;
             if (currentLossAmount > maxLossAmount) {
                maxLossAmount = currentLossAmount;
                maxLossPercentage = currentLossPercentage;
                maxLossDate = new Date(dateString).toISOString().split('T')[0];
            }
            if (currentGainAmount > maxGainAmount) {
                maxGainAmount = currentGainAmount;
                maxGainPercentage = currentGainPercentage;
                maxGainDate = new Date(dateString).toISOString().split('T')[0];
            }

            const currentLossAmountEcrete = totalInvestedEcrete - chartData.portfolioValueEcrete[index];
            const currentLossPercentageEcrete = (currentLossAmountEcrete / totalInvestedEcrete) * 100;
             const currentGainAmountEcrete = chartData.portfolioValueEcrete[index] - totalInvestedEcrete;
            const currentGainPercentageEcrete = (currentGainAmountEcrete / totalInvestedEcrete) * 100;
           const currentGainLossEcreteAvecGain =  chartData.securedGains[index] + chartData.securedGainsInterest[index] + (chartData.portfolioValueEcrete[index] - chartData.totalInvestedEcreteHistory[index]);

             if (currentGainLossEcreteAvecGain < 0 && Math.abs(currentGainLossEcreteAvecGain) > Math.abs(maxLossAmountEcrete)) {
                maxLossAmountEcrete = currentGainLossEcreteAvecGain;
                maxLossDateEcrete = new Date(dateString).toISOString().split('T')[0];
                 maxLossPercentageEcrete = (currentGainLossEcreteAvecGain / totalInvestedEcrete) * 100
           }
             if (currentGainAmountEcrete > maxGainAmountEcrete) {
                maxGainAmountEcrete = currentGainAmountEcrete;
                maxGainPercentageEcrete = currentGainPercentageEcrete;
                maxGainDateEcrete = new Date(dateString).toISOString().split('T')[0];
            }
    });
        chartData.cappedDatesAndAmountsWithInterest = cappedDatesAndAmountsWithInterest
         return chartData;
}

function updateUIWithResults(chartData) {
    const lastPrice = chartData.prices[chartData.prices.length - 1];
      const filteredData = chartData.prices.map((price, index) => ({ date: chartData.labels[index], price: price }))

    const totalInvested = chartData.investments[chartData.investments.length - 1]
    const totalShares = chartData.totalShares[chartData.totalShares.length - 1]
    const gainLossPercentage = ((totalShares * lastPrice - totalInvested) / totalInvested) * 100;
     const gainLossAmount = (totalShares * lastPrice - totalInvested);
   const stockChangePercentage = ((lastPrice - chartData.prices[0]) / chartData.prices[0]) * 100;
    const  numberOfPayments =  chartData.sharesBought.length
    // Mettre à jour l'affichage des résultats
    document.getElementById('finalTotalInvested').innerHTML = `<span class="${gainLossPercentage >= 0 ? 'positive' : 'negative'}">${totalInvested.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
    document.getElementById('finalNumberOfPayments').innerHTML = `${numberOfPayments} mois soit ${Math.floor(numberOfPayments / 12)} ans et ${numberOfPayments % 12} mois`;
      document.getElementById('finalStockChangePercentage').innerHTML = `<span class="${stockChangePercentage >= 0 ? 'positive' : 'negative'}">${stockChangePercentage.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span>`;
       document.getElementById('finalPortfolioValue').innerHTML = `<span class="${gainLossPercentage >= 0 ? 'positive' : 'negative'}">${(totalShares * lastPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> au ${new Date(filteredData[filteredData.length - 1].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
     document.getElementById('finalGainLossLabel').innerHTML = gainLossPercentage >= 0 ? 'Gain' : 'Perte';
     document.getElementById('finalGainLossPercentage').innerHTML = `<span class="${gainLossAmount >= 0 ? 'positive' : 'negative'}">${gainLossAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> au ${new Date(filteredData[filteredData.length - 1].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} soit <span class="${gainLossPercentage >= 0 ? 'positive' : 'negative'}">${gainLossPercentage.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span>`;
   document.getElementById('finalMaxLossAmount').innerHTML = `<span class="negative">-${Math.abs(chartData.maxLossAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> soit : <span class="negative">-${Math.abs(chartData.maxLossPercentage).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span> de l'investissement au : ${new Date(chartData.maxLossDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
     document.getElementById('finalMaxGainAmount').innerHTML = `<span class="positive">${chartData.maxGainAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> soit : <span class="positive">${chartData.maxGainPercentage.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span> de l'investissement au : ${new Date(chartData.maxGainDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;

     const finalPortfolioValueEcrete = chartData.totalSharesEcrete[chartData.totalSharesEcrete.length - 1] * lastPrice;
        const finalPortfolioValueEcreteAvecGain = chartData.portfolioValueEcreteAvecGain[chartData.portfolioValueEcreteAvecGain.length - 1];
        const totalInvestedEcrete = chartData.totalInvestedEcreteHistory[chartData.totalInvestedEcreteHistory.length - 1]
         const finalGainLossAmountEcrete = finalPortfolioValueEcreteAvecGain - totalInvestedEcrete;
        const finalGainLossPercentageEcrete = (finalGainLossAmountEcrete / totalInvestedEcrete) * 100;

    document.getElementById('portfolioValueEcreteAvecGain').innerHTML = `<span class="${finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${finalPortfolioValueEcreteAvecGain.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
    document.getElementById('finalPortfolioValueEcrete').innerHTML = `<span class="${finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${finalPortfolioValueEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
    document.getElementById('finalTotalEcrete').innerHTML = `<span class="${finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${chartData.securedGains[chartData.securedGains.length - 1].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
      document.getElementById('finalTotalEcreteInterest').innerHTML = `<span class="${finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${chartData.securedGainsInterest[chartData.securedGainsInterest.length - 1].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
    document.getElementById('finalGainEcrete').innerHTML = `<span class="${finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${finalGainLossAmountEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> au ${new Date(filteredData[filteredData.length - 1].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} soit <span class="${finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${finalGainLossPercentageEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span>`;
    document.getElementById('finalMaxLossAmountEcrete').innerHTML = `<span class="negative">-${Math.abs(chartData.maxLossAmountEcrete).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> soit : <span class="negative">-${Math.abs(chartData.maxLossPercentageEcrete).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span> de l'investissement au : ${new Date(chartData.maxLossDateEcrete).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    document.getElementById('finalMaxGainAmountEcrete').innerHTML = `<span class="positive">${chartData.maxGainAmountEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> soit : <span class="positive">${chartData.maxGainPercentageEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span> de l'investissement au : ${new Date(chartData.maxGainDateEcrete).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;


    const securedGainsTableBody = document.getElementById('securedGainsTableBody');
    securedGainsTableBody.innerHTML = '';
    chartData.cappedDatesAndAmountsWithInterest.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.date}</td><td>${item.amount.toFixed(2).replace('.', ',')} ${currencySymbol}</td><td>${item.interest.toFixed(2).replace('.', ',')} ${currencySymbol}</td>`;
        securedGainsTableBody.appendChild(row);
    });

    updateEvolutionChart(chartData.labels, chartData.prices);
    updateInvestmentChart(chartData.labels, chartData.investments, chartData.portfolio, chartData.portfolioValueEcreteAvecGain);
}

function handleFetchDataError(error) {
    console.error('Erreur lors de la récupération des données :', error);
    alert('Erreur lors de la récupération des données. Veuillez réessayer.');
}

// --- Mise à Jour des Graphiques ---
function updateEvolutionChart(labels, prices) {
    const ctxEvolution = document.getElementById('evolutionChart').getContext('2d');
    if (evolutionChart) evolutionChart.destroy();
    evolutionChart = new Chart(ctxEvolution, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                    label: 'Prix du support',
                    data: prices,
                    borderColor: 'rgb(0, 0, 255)',
                    tension: 0.1,
                    yAxisID: 'y',
                    order: 1
                }]
        },
        options: {
           responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Évolution du support choisi'
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

function updateInvestmentChart(labels, investments, portfolio, portfolioValueEcreteAvecGain) {
    const ctxInvestment = document.getElementById('investmentChart').getContext('2d');
    if (investmentChart) investmentChart.destroy();
    investmentChart = new Chart(ctxInvestment, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                    label: 'Valeur du portefeuille',
                    data: portfolio,
                    type: 'line',
                    borderColor: 'rgb(255, 135, 0)',
                    tension: 0.1,
                    yAxisID: 'y',
                    order: 1
                },
                {
                    label: 'Valeur du portefeuille écrêté avec gains',
                    data: portfolioValueEcreteAvecGain,
                    type: 'line',
                    borderColor: 'rgb(0, 0, 255)',
                    tension: 0.1,
                    yAxisID: 'y',
                    order: 2
                },
                {
                    label: 'Montant total investi',
                    data: investments,
                    backgroundColor: 'rgb(0, 255, 0)',
                    borderColor: 'rgb(0, 255, 0)',
                    borderWidth: 1,
                    yAxisID: 'y',
                    order: 3
                }]
        },
         options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Montants investis et évolution du portefeuille'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// --- Gestion du Thème ---
function toggleTheme() {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const currentTheme = body.getAttribute('data-theme');

    if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

// --- Génération du fichier Excel ---
function generateFileName() {
  const now = new Date();
  const formattedDate = now.toISOString().replace(/[-:.T]/g, '').slice(0, 14);
  return `${formattedDate}FoxVelocity.xlsx`;
}

function generateExcelFile(chartData, cappedDatesAndAmounts) {
    const headers = [
        'date', 'price', 'totalInvested', 'portfolioValue', 'sharesBought', 'totalShares', 'totalSharesSoldEcrete', 'totalSharesEcrete', 'securedGains', 'securedGainsInterest', 'portfolioValueEcreteSansGain', 'portfolioValueEcrete', 'portfolioValueEcreteAvecGain', 'gainLossEcrete', 'gainLossEcreteAvecGain'
    ];
    const frenchHeaders = [
        'Date', 'Prix', 'Montant Total Investi', 'Valeur du Portefeuille', 'Parts Achetées', 'Total Parts', 'Parts Vendues Écrêtage', 'Total Parts Écrêtage', 'Gains Sécurisés', 'Intérêts des Gains Sécurisés', 'Valeur du Portefeuille Écrêté sans Gains', 'Valeur du Portefeuille Écrêté', 'Valeur du Portefeuille Écrêté avec Gains', 'Plus/Moins-value Ecrêtée', 'Plus/Moins-value Ecrêtée avec Gains'
    ];

    const ws = XLSX.utils.json_to_sheet([], { header: headers });
    XLSX.utils.sheet_add_aoa(ws, [frenchHeaders], { origin: 'A2' });

    const data = chartData.labels.map((label, index) => ({
        date: label,
        price: chartData.prices[index],
        totalInvested: chartData.investments[index],
        portfolioValue: chartData.portfolio[index],
        sharesBought: chartData.sharesBought[index],
        totalShares: chartData.totalShares[index],
        totalSharesSoldEcrete: chartData.totalSharesSoldEcrete[index],
        totalSharesEcrete: chartData.totalSharesEcrete[index],
        securedGains: chartData.securedGains[index],
        securedGainsInterest: chartData.securedGainsInterest[index],
        portfolioValueEcreteSansGain: chartData.portfolioValueEcreteSansGain[index],
        portfolioValueEcrete: chartData.portfolioValueEcrete[index],
        portfolioValueEcreteAvecGain: chartData.portfolioValueEcreteAvecGain[index],
        gainLossEcrete: chartData.portfolioValueEcrete[index] - chartData.totalInvestedEcreteHistory[index],
         gainLossEcreteAvecGain: chartData.securedGains[index] + chartData.securedGainsInterest[index] + (chartData.portfolioValueEcrete[index] - chartData.totalInvestedEcreteHistory[index])
    }));


    XLSX.utils.sheet_add_json(ws, data, { origin: 'A3', skipHeader: true });

    XLSX.utils.sheet_add_aoa(ws, [['Date', 'Montant écrêté', 'Intérêts du montant écrêté']], { origin: { r: data.length + 4, c: 0 } });
    cappedDatesAndAmounts.forEach((item, index) => {
        XLSX.utils.sheet_add_aoa(ws, [[item.date, item.amount.toFixed(2).replace('.', ','), item.interest.toFixed(2).replace('.', ',')]], { origin: { r: data.length + 5 + index, c: 0 } });
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Données');
    XLSX.writeFile(wb, generateFileName());
}


function downloadExcel() {
    if(excelData && excelCappedDatesAndAmounts){
        generateExcelFile(excelData, excelCappedDatesAndAmounts);
   } else {
        alert("Aucune donnée à exporter, veuillez faire une simulation.");
    }
}

function formatNumberInput(input) {
let value = input.value.replace(/\D/g, ''); // Supprime tout caractère non numérique
if (value.length > 16) {
value = value.slice(0, 16);
}
input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
document.getElementById('initialInvestment').addEventListener('input', function() {
formatNumberInput(this);
});
document.getElementById('monthlyInvestment').addEventListener('input', function() {
formatNumberInput(this);
});