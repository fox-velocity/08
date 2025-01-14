// excel.js

import * as XLSX from 'xlsx';

function generateFileName() {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:.T]/g, '').slice(0, 14);
    return `${formattedDate}FoxVelocity.xlsx`;
}

export function generateExcelFile(chartData, cappedDatesAndAmounts, currencySymbol) {
    // En-têtes en anglais
     const headers = [
       'date', 'price', 'totalInvested', 'portfolioValue', 'sharesBought', 'totalShares', 'totalSharesSoldEcrete', 'totalSharesEcrete', 'securedGains', 'securedGainsInterest', 'portfolioValueEcreteSansGain', 'portfolioValueEcrete', 'portfolioValueEcreteAvecGain', 'gainLossEcrete', 'gainLossEcreteAvecGain'
    ];
    // En-têtes en français
    const frenchHeaders = [
      'Date', 'Prix', 'Montant Total Investi', 'Valeur du Portefeuille', 'Parts Achetées', 'Total Parts', 'Parts Vendues Écrêtage', 'Total Parts Écrêtage', 'Gains Sécurisés', 'Intérêts des Gains Sécurisés', 'Valeur du Portefeuille Écrêté sans Gains', 'Valeur du Portefeuille Écrêté', 'Valeur du Portefeuille Écrêté avec Gains', 'Plus/Moins-value Ecrêtée', 'Plus/Moins-value Ecrêtée avec Gains'
    ];

    // Créer une feuille de calcul avec les en-têtes
    const ws = XLSX.utils.json_to_sheet([], { header: headers });
     // Ajouter la deuxième ligne d'en-têtes en français
     XLSX.utils.sheet_add_aoa(ws, [frenchHeaders], { origin: 'A2' });


     // Préparer les données pour la feuille de calcul
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

    // Ajouter les données
    XLSX.utils.sheet_add_json(ws, data, { origin: 'A3', skipHeader: true });

     // Ajouter les dates et montants de l'écrêtage
      XLSX.utils.sheet_add_aoa(ws, [['Date', 'Montant écrêté', 'Intérêts du montant écrêté']], { origin: { r: data.length + 4, c: 0 } });
     cappedDatesAndAmounts.forEach((item, index) => {
        XLSX.utils.sheet_add_aoa(ws, [[item.date, item.amount.toFixed(2).replace('.', ','), item.interest.toFixed(2).replace('.', ',')]], { origin: { r: data.length + 5 + index, c: 0 } });
    });

    // Créer un classeur et ajouter la feuille de calcul
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Données');

     // Enregistrer le fichier Excel avec un nom dynamique
    XLSX.writeFile(wb, generateFileName());
}