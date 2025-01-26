// excel.js

function generateFileName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}${minutes}${seconds}`;
    const stockSymbolElement = document.getElementById('stockSymbol');
    const stockSymbol = stockSymbolElement ? stockSymbolElement.textContent : 'Unknown';
    return `${formattedDate}-${formattedTime}-${stockSymbol}-FoxVelocity.xlsx`;
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
    // Ajustement automatique de la largeur des colonnes
    const range = XLSX.utils.decode_range(ws['!ref']);
    const numberOfColumns = range.e.c + 1;

    const wscols = [];
    for (let i = 0; i < numberOfColumns; i++) {
        let maxLength = 0;
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            const cellAddress = XLSX.utils.encode_cell({ c: i, r: rowNum });
           if (ws[cellAddress] && ws[cellAddress].v) {
                const cellValue = String(ws[cellAddress].v);
                maxLength = Math.max(maxLength, cellValue.length);
             }

            if (rowNum <= 1) { // Check only the first two rows for header
                const cellAddressHeader = XLSX.utils.encode_cell({ c: i, r: rowNum });
                if (ws[cellAddressHeader] && ws[cellAddressHeader].v) {
                     const cellValueHeader = String(ws[cellAddressHeader].v);
                     maxLength = Math.max(maxLength, cellValueHeader.length);
                }
            }
        }
            wscols.push({ wch: maxLength + 2 }); // add some extra space
        }
       ws['!cols'] = wscols;

    // Créer un classeur et ajouter la feuille de calcul
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Données');

    // Convertir le workbook en un tableau de bytes pour le téléchargement
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Créer un Blob à partir du tableau de bytes
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    // Créer un lien de téléchargement
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateFileName(); // Utiliser la fonction generateFileName
    document.body.appendChild(a); // Ajouter le lien au document
    a.click(); // Simuler un clic sur le lien pour démarrer le téléchargement
    document.body.removeChild(a); // Supprimer le lien
    URL.revokeObjectURL(url); // Libérer l'URL de l'objet blob
}
