export function updateStockInfo(name, symbol, exchange, currencySymbol, type, industry) {
    document.getElementById('stockName').innerText = name;
    document.getElementById('stockSymbol').innerText = symbol;
   document.getElementById('stockExchange').innerText = exchange;
    document.getElementById('stockCurrency').innerText = currencySymbol;
   document.getElementById('stockType').innerText = type;
    document.getElementById('stockIndustry').innerText = industry;
    document.getElementById('stockInfo').style.display = 'block';
   document.getElementById('currencySymbolLabel').innerText = currencySymbol;
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
     document.getElementById('finalTotalInvested').innerHTML = `<span class="${results.gainLossPercentage >= 0 ? 'positive' : 'negative'}">${results.totalInvested.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
     document.getElementById('finalNumberOfPayments').innerHTML = `${results.numberOfPayments} mois soit ${Math.floor(results.numberOfPayments / 12)} ans et ${results.numberOfPayments % 12} mois`;
    document.getElementById('finalStockChangePercentage').innerHTML = `<span class="${results.stockChangePercentage >= 0 ? 'positive' : 'negative'}">${results.stockChangePercentage.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span>`;
     document.getElementById('finalPortfolioValue').innerHTML = `<span class="${results.gainLossPercentage >= 0 ? 'positive' : 'negative'}">${results.portfolioValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> au ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
   document.getElementById('finalGainLossLabel').innerHTML = results.gainLossPercentage >= 0 ? 'Gain' : 'Perte';
   
    document.getElementById('finalGainLossPercentage').innerHTML = `<span class="${results.gainLossAmount >= 0 ? 'positive' : 'negative'}">${results.gainLossAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> au ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} soit <span class="${results.gainLossPercentage >= 0 ? 'positive' : 'negative'}">${results.gainLossPercentage.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span>`;
   
    document.getElementById('finalMaxLossAmount').innerHTML = `<span class="negative">-${Math.abs(results.maxLossAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> soit : <span class="negative">-${Math.abs(results.maxLossPercentage).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span> de l'investissement au : ${new Date(results.maxLossDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
   document.getElementById('finalMaxGainAmount').innerHTML = `<span class="positive">${results.maxGainAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> soit : <span class="positive">${results.maxGainPercentage.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span> de l'investissement au : ${new Date(results.maxGainDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
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

   // Portefeuille écrêté
   document.getElementById('portfolioValueEcreteAvecGain').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.finalPortfolioValueEcreteAvecGain.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
   document.getElementById('finalPortfolioValueEcrete').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.finalPortfolioValueEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
   document.getElementById('finalTotalEcrete').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.securedGains.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
    document.getElementById('finalTotalEcreteInterest').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.securedGainsInterest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span>`;
    document.getElementById('finalTotalInvested').textContent = finalTotalInvested.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    document.getElementById('finalNumberOfPayments').textContent = finalNumberOfPayments;
    document.getElementById('finalStockChangePercentage').textContent = finalStockChangePercentage.toFixed(2) + '%';
    document.getElementById('finalPortfolioValue').textContent =  finalPortfolioValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    document.getElementById('finalGainLossPercentage').textContent = finalGainLossPercentage.toFixed(2) + '%';
   document.getElementById('finalMaxLossAmount').textContent =  finalMaxLossAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
   document.getElementById('finalMaxGainAmount').textContent =  finalMaxGainAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

    document.getElementById('finalGainEcrete').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.finalGainLossAmountEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> au ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} soit <span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.finalGainLossPercentageEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span>`;
   
   
    document.getElementById('finalMaxLossAmountEcrete').innerHTML = `<span class="negative">-${Math.abs(results.maxLossAmountEcrete).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> soit : <span class="negative">-${Math.abs(results.maxLossPercentageEcrete).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span> de l'investissement au : ${new Date(results.maxLossDateEcrete).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
   document.getElementById('finalMaxGainAmountEcrete').innerHTML = `<span class="positive">${results.maxGainAmountEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencySymbol}</span> soit : <span class="positive">${results.maxGainPercentageEcrete.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} %</span> de l'investissement au : ${new Date(results.maxGainDateEcrete).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
   
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

export function updateSecuredGainsTable(cappedDatesAndAmountsWithInterest, currencySymbol) {
   const securedGainsTableBody = document.getElementById('securedGainsTableBody');
   securedGainsTableBody.innerHTML = ''; // Vider le contenu précédent
   cappedDatesAndAmountsWithInterest.forEach(item => {
       const row = document.createElement('tr');
        row.innerHTML = `<td>${item.date}</td><td>${item.amount.toFixed(2).replace('.', ',')} ${currencySymbol}</td><td>${item.interest.toFixed(2).replace('.', ',')} ${currencySymbol}</td>`;
       securedGainsTableBody.appendChild(row);
   });
        row.appendChild(dateCell);
        row.appendChild(gainCell);
        row.appendChild(interestCell)
        tableBody.appendChild(row);
    });
}

export function displaySuggestions(results) {
   const suggestionsContainer = document.getElementById('suggestions');
     suggestionsContainer.innerHTML = results.map(result =>
       `<div onclick="selectSymbol('${result.symbol}', '${(result.longname || '').replace(/'/g, "\\'")}', '${(result.exchange || '').replace(/'/g, "\\'")}', '${(result.quoteType || '').replace(/'/g, "\\'")}', '${(result.actor || '').replace(/'/g, "\\'")}', '${(result.industry || '').replace(/'/g, "\\'")}')">
           ${result.shortname || result.symbol} (${result.symbol})
       </div>`
   ).join('');
     if (results.length === 0) {
         suggestionsContainer.innerHTML = "Aucun résultat trouvé.";
     }
}
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
    loadingIndicator.style.display = show ? 'block' : 'none';
}
// Fonction pour modifier la visibilité des elements
export function setElementVisibility(elementId, show) {
    const element = document.getElementById(elementId);
   element.style.display = show ? 'block' : 'none';
}
    const elements = document.querySelectorAll(`.${elementId}`);
    elements.forEach(element => {
        element.style.display = show ? 'block' : 'none';
    });
   const pdfButton = document.getElementById('download-pdf');
    if(pdfButton) {
        pdfButton.style.display = show ? 'block' : 'none';
    }
}
