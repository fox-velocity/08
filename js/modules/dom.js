// dom.js

export function updateStockInfo(name, symbol, exchange, currencySymbol, type, industry) {
    document.getElementById('stockName').innerText = name;
    document.getElementById('stockSymbol').innerText = symbol;
    document.getElementById('stockExchange').innerText = exchange;
    document.getElementById('stockCurrency').innerText = currencySymbol;
    document.getElementById('stockType').innerText = type;
    document.getElementById('stockIndustry').innerText = industry;
    document.getElementById('stockInfo').style.display = 'block';
    document.getElementById('currencySymbolLabel').innerText = currencySymbol;
}

export function updateResultsDisplay(results, currencySymbol) {
    document.getElementById('finalTotalInvested').innerHTML = `<span class="${results.gainLossPercentage >= 0 ? 'positive' : 'negative'}">${results.totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span>`;
    document.getElementById('finalNumberOfPayments').innerHTML = `${results.numberOfPayments} mois soit ${Math.floor(results.numberOfPayments / 12)} ans et ${results.numberOfPayments % 12} mois`;
    document.getElementById('finalStockChangePercentage').innerHTML = `<span class="${results.stockChangePercentage >= 0 ? 'positive' : 'negative'}">${results.stockChangePercentage.toFixed(2)} %</span>`;
    document.getElementById('finalPortfolioValue').innerHTML = `<span class="${results.gainLossPercentage >= 0 ? 'positive' : 'negative'}">${results.portfolioValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span> au ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    document.getElementById('finalGainLossLabel').innerHTML = results.gainLossPercentage >= 0 ? 'Gain' : 'Perte';

    document.getElementById('finalGainLossPercentage').innerHTML = `<span class="${results.gainLossAmount >= 0 ? 'positive' : 'negative'}">${results.gainLossAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span> au ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} soit <span class="${results.gainLossPercentage >= 0 ? 'positive' : 'negative'}">${results.gainLossPercentage.toFixed(2)} %</span>`;

    document.getElementById('finalMaxLossAmount').innerHTML = `<span class="negative">-${Math.abs(results.maxLossAmount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span> soit : <span class="negative">-${Math.abs(results.maxLossPercentage).toFixed(2)} %</span> de l'investissement au : ${new Date(results.maxLossDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    document.getElementById('finalMaxGainAmount').innerHTML = `<span class="positive">${results.maxGainAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span> soit : <span class="positive">${results.maxGainPercentage.toFixed(2)} %</span> de l'investissement au : ${new Date(results.maxGainDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    // Portefeuille écrêté
    document.getElementById('portfolioValueEcreteAvecGain').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.finalPortfolioValueEcreteAvecGain.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span>`;
    document.getElementById('finalPortfolioValueEcrete').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.finalPortfolioValueEcrete.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span>`;
    document.getElementById('finalTotalEcrete').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.securedGains.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span>`;
        document.getElementById('finalTotalEcreteInterest').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.securedGainsInterest.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span>`;

    document.getElementById('finalGainEcrete').innerHTML = `<span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.finalGainLossAmountEcrete.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span> au ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} soit <span class="${results.finalGainLossPercentageEcrete >= 0 ? 'positive' : 'negative'}">${results.finalGainLossPercentageEcrete.toFixed(2)} %</span>`;


    document.getElementById('finalMaxLossAmountEcrete').innerHTML = `<span class="negative">-${Math.abs(results.maxLossAmountEcrete).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span> soit : <span class="negative">-${Math.abs(results.maxLossPercentageEcrete).toFixed(2)} %</span> de l'investissement au : ${new Date(results.maxLossDateEcrete).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    document.getElementById('finalMaxGainAmountEcrete').innerHTML = `<span class="positive">${results.maxGainAmountEcrete.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</span> soit : <span class="positive">${results.maxGainPercentageEcrete.toFixed(2)} %</span> de l'investissement au : ${new Date(results.maxGainDateEcrete).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;

}

export function updateSecuredGainsTable(cappedDatesAndAmountsWithInterest, currencySymbol) {
    const securedGainsTableBody = document.getElementById('securedGainsTableBody');
    securedGainsTableBody.innerHTML = ''; // Vider le contenu précédent
    cappedDatesAndAmountsWithInterest.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.date}</td><td>${item.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</td><td>${item.interest.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}</td>`;
        securedGainsTableBody.appendChild(row);
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

export function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = show ? 'block' : 'none';
}
export function setElementVisibility(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
     const downloadButtons = document.querySelectorAll('.download-button');
    downloadButtons.forEach(button => {
        button.style.display = show ? 'block' : 'none';
    });

}
