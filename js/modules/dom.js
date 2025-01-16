// dom.js
export function updateStockInfo(name, symbol, exchange, currency, type, industry) {
    document.getElementById('stockName').textContent = name;
    document.getElementById('stockSymbol').textContent = symbol;
    document.getElementById('stockExchange').textContent = exchange;
    document.getElementById('stockCurrency').textContent = currency;
    document.getElementById('stockType').textContent = type;
    document.getElementById('stockIndustry').textContent = industry;
    document.getElementById('currencySymbolLabel').textContent = currency;
}

export function updateResultsDisplay(results, currencySymbol) {
    const {
        finalTotalInvested,
        finalNumberOfPayments,
        finalStockChangePercentage,
        finalPortfolioValue,
        finalGainLossPercentage,
         finalMaxLossAmount,
         finalMaxGainAmount,
         portfolioValueEcreteAvecGain,
         finalPortfolioValueEcrete,
         finalTotalEcrete,
          finalTotalEcreteInterest,
          finalGainEcrete,
           finalMaxLossAmountEcrete,
          finalMaxGainAmountEcrete
    } = results;


    document.getElementById('finalTotalInvested').textContent = finalTotalInvested.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    document.getElementById('finalNumberOfPayments').textContent = finalNumberOfPayments;
    document.getElementById('finalStockChangePercentage').textContent = finalStockChangePercentage.toFixed(2) + '%';
    document.getElementById('finalPortfolioValue').textContent =  finalPortfolioValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    document.getElementById('finalGainLossPercentage').textContent = finalGainLossPercentage.toFixed(2) + '%';
   document.getElementById('finalMaxLossAmount').textContent =  finalMaxLossAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
   document.getElementById('finalMaxGainAmount').textContent =  finalMaxGainAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

     document.getElementById('portfolioValueEcreteAvecGain').textContent = portfolioValueEcreteAvecGain.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    document.getElementById('finalPortfolioValueEcrete').textContent =  finalPortfolioValueEcrete.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
   document.getElementById('finalTotalEcrete').textContent =  finalTotalEcrete.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
     document.getElementById('finalTotalEcreteInterest').textContent =  finalTotalEcreteInterest.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
     document.getElementById('finalGainEcrete').textContent =  finalGainEcrete.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
        document.getElementById('finalMaxLossAmountEcrete').textContent =  finalMaxLossAmountEcrete.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
   document.getElementById('finalMaxGainAmountEcrete').textContent =  finalMaxGainAmountEcrete.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    
    
    
      const gainLossLabel = document.getElementById('finalGainLossLabel');
       if (finalGainLossPercentage >= 0) {
        gainLossLabel.textContent = 'Gain';
         gainLossLabel.classList.remove('negative');
        gainLossLabel.classList.add('positive');
    } else {
        gainLossLabel.textContent = 'Perte';
          gainLossLabel.classList.remove('positive');
        gainLossLabel.classList.add('negative');
    }
}
export function updateSecuredGainsTable(cappedDatesAndAmounts, currencySymbol) {
    const tableBody = document.getElementById('securedGainsTableBody');
    tableBody.innerHTML = ''; // Clear previous data

    cappedDatesAndAmounts.forEach(item => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const gainCell = document.createElement('td');
        const interestCell = document.createElement('td');
        dateCell.textContent = item.date;
        gainCell.textContent = item.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
           interestCell.textContent = item.interest.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

        row.appendChild(dateCell);
        row.appendChild(gainCell);
        row.appendChild(interestCell)
        tableBody.appendChild(row);
    });
}

export function displaySuggestions(results) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = ""; // Clear previous suggestions
    if (!results || results.length === 0) {
        suggestionsContainer.innerHTML = "Aucun résultat trouvé.";
        return;
    }

    results.forEach(item => {
        const suggestionDiv = document.createElement('div');
         suggestionDiv.textContent = `${item.symbol} - ${item.name} (${item.exchange})`;
         suggestionDiv.onclick = function() {
           window.selectSymbol(item.symbol, item.name, item.exchange, item.type, item.sector, item.industry);
         };
          suggestionsContainer.appendChild(suggestionDiv);
    });
}
export function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = show ? 'block' : 'none';
}
// Fonction pour modifier la visibilité des elements
export function setElementVisibility(elementId, show) {
    const elements = document.querySelectorAll(`.${elementId}`);
    elements.forEach(element => {
        element.style.display = show ? 'block' : 'none';
    });
   const pdfButton = document.getElementById('download-pdf');
    if(pdfButton) {
        pdfButton.style.display = show ? 'block' : 'none';
    }
}
