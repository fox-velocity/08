// pdf.js
export async function generatePDF(pdfMake, logoBase64) {
    if (!pdfMake) {
        alert('pdfMake n\'est pas disponible');
        console.error("pdfMake n'est pas chargé");
        return;
    }

    await waitForChart('investmentChart');

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [15, 15, 15, 50],
        content: [
            { text: 'Simulateur de Rendement d\'Investissement', style: 'title' },
            { text: 'Informations sur l\'instrument financier', style: 'subtitle' },
            getStockInfo(),
            { text: 'Synthèse investissement', style: 'subtitle' },
             getChartWithBorder('evolutionChart'),
            getTopResults(),
            { text: 'Résultats', style: 'subtitle', pageBreak: 'before' },
            getResults(),
            { text: 'Résultats avec écrêtage des gains', style: 'subtitle' },
             getResultsWithCapping(),
             getSecuredGainsTable(),
            { text: 'Graphiques évolutions des portefeuilles', style: 'subtitle', pageBreak: 'before' },
            getChartWithBorder('investmentChart'),
            getChartWithBorder('savingsChart'),
            { text: 'Les performances passées des instruments financiers ne garantissent en aucun cas leurs performances futures. Ce simulateur est destiné à fournir une estimation basée sur des données historiques et ne prend pas en compte les événements imprévus, les évolutions du marché ou les frais associés aux investissements. Il est important de noter que les résultats obtenus ne constituent pas un conseil en investissement et que tout investissement comporte des risques, y compris la perte partielle ou totale du capital. Il est fortement recommandé de consulter un professionnel, tel qu\'un conseiller en gestion de patrimoine (CGP), avant de prendre toute décision d\'investissement, afin d\'obtenir des conseils personnalisés en fonction de votre profil et de vos objectifs financiers.', style: 'paragraph' },
        ],
        styles: {
            title: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 15]
            },
            subtitle: {
                fontSize: 14,
                bold: true,
                alignment: 'center',
                margin: [0, 10, 0, 15]
            },
            paragraph: {
                fontSize: 8,
                alignment: 'justify',
                margin: [10, 20, 10, 10]
            },
            tableHeader: {
                bold: true,
                fontSize: 8,
                fillColor: '#dddddd',
                margin: [0, 5, 0, 5]
            },
            tableCell: {
                fontSize: 8,
                margin: [0, 5, 0, 5]
            },
            positive: {
                color: 'green'
            },
            negative: {
                color: 'red'
            },
            chartContainer: {
                margin: [0, 0, 0, 20],
            }
        },
        footer: function (currentPage, pageCount) {
            return {
                table: {
                    widths: ['*', 'auto', '*'],
                    body: [
                        [
                            {
                                text: 'Fox Velocity',
                                alignment: 'center',
                                fontSize: 8,
                                margin: [0, 10, 0, 0]
                            },
                            {
                                image: logoBase64,
                                width: 25,
                                alignment: 'center',
                                margin: [0, 0, 0, 0]
                            },
                            {
                                text: `Page ${currentPage.toString()} sur ${pageCount}`,
                                alignment: 'center',
                                fontSize: 8,
                                margin: [0, 10, 0, 0]
                            }
                        ]
                    ]
                },
                layout: 'noBorders'
            };
        }
    };

    // Création du pdf
    pdfMake.createPdf(docDefinition).download('investissement-chart.pdf');

    //fonction attente 1 graphique
    function waitForChart(chartId) {
        return new Promise((resolve) => {
            function checkChartReady() {
                const isChartReady = document.getElementById(chartId) && document.getElementById(chartId).getContext('2d') && investmentChart;
                if (isChartReady) {
                    setTimeout(resolve, 100)
                } else {
                    setTimeout(checkChartReady, 100);
                }
            }
            checkChartReady();
        });
    }

    function getStockInfo() {
        const stockInfo = document.getElementById('stockInfo');
        if (!stockInfo) {
            return {};
        }
        const stockName = document.getElementById('stockName').textContent;
        const stockSymbol = document.getElementById('stockSymbol').textContent;
        const stockCurrency = document.getElementById('stockCurrency').textContent;
        const stockExchange = document.getElementById('stockExchange').textContent;
        const stockType = document.getElementById('stockType').textContent;
        const stockIndustry = document.getElementById('stockIndustry').textContent;
        return {
            table: {
                body: [
                    [`Nom: ${stockName}`],
                    [`Symbole: ${stockSymbol}`],
                    [`Devise: ${stockCurrency}`],
                    [`Place de Cotation: ${stockExchange}`],
                    [`Type: ${stockType}`],
                    [`Industrie: ${stockIndustry}`]
                ],
                widths: ['*']
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 10]
        };
    }

    function getTopResults() {
        const topResults = document.getElementById('topResults');
        if (!topResults) {
            return {};
        }
         // Formattez les nombres avec des espaces pour les milliers
        const totalInvested = formatNumber(document.getElementById('finalTotalInvested').textContent.replace(/\s/g, ''));
        const investmentDuration = document.getElementById('finalNumberOfPayments').textContent;
        const stockChangePercentage = formatPercentage(document.getElementById('finalStockChangePercentage').textContent)
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const initialInvestment = formatNumber(document.getElementById('initialInvestment').value);
        const monthlyInvestment = formatNumber(document.getElementById('monthlyInvestment').value);
        const interestRate = document.getElementById('interestRate').value;
        const cappingPercentage = document.getElementById('cappingPercentage').value;
        const minCappingAmount = document.getElementById('minCappingAmount').value;
          const currencySymbol =  document.getElementById('currencySymbolLabel').textContent;

        return {
            table: {
                body: [
                   [`Total investi: ${totalInvested} ${currencySymbol}`],
                    [`Durée investissement: ${investmentDuration}`],
                    [
                        {
                            text: [
                                'Évolution instrument financier: ',
                               { text: stockChangePercentage, style: getStyleForValue(stockChangePercentage) }
                           ],
                        }
                    ],
                    [`Date de début: ${startDate}`],
                    [`Date de fin: ${endDate}`],
                    [`Versement initial: ${initialInvestment} ${currencySymbol}`],
                    [`Montant mensuel investi: ${monthlyInvestment} ${currencySymbol}`],
                    [""], // Ligne vide ajoutée
                    [`Réglage des options :`],
                    [`limite seuil d'écrêtage: ${cappingPercentage*100} %`],
                    [`Valeurs limite seuil d'écrêtage: ${minCappingAmount}`],
                    [`Taux d'intérêt annuel: ${interestRate*100} %`],
                ],
                widths: ['*']
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 10],
        };
    }

    function getResults() {
        const results = document.getElementById('results');
        if (!results) {
            return {};
        }
        // Formattez les nombres avec des espaces pour les milliers
        const portfolioValue = formatNumber(document.getElementById('finalPortfolioValue').textContent.replace(/\s/g, ''));
        let finalGainLossPercentage = document.getElementById('finalGainLossPercentage').textContent;
           // Diviser par 10 si ce n'est pas vide
        if (finalGainLossPercentage) {
            finalGainLossPercentage = (parseFloat(finalGainLossPercentage.replace(/\s/g, '').replace(',', '.').replace('%', '')) / 10).toString()
        }
        const maxLossAmount = formatNumber(document.getElementById('finalMaxLossAmount').textContent);
        const maxGainAmount = formatNumber(document.getElementById('finalMaxGainAmount').textContent);
        const currencySymbol =  document.getElementById('currencySymbolLabel').textContent;
        return {
            table: {
                body: [
                    [`Valeur finale du portefeuille: ${portfolioValue} ${currencySymbol}`],
                     [
                        {
                           text: [
                                'Gain ou Perte: ',
                              { text: formatPercentage(finalGainLossPercentage), style: getStyleForValue(finalGainLossPercentage) }
                           ],
                       }
                   ],
                   [`Montant de moins-value potentielle maximale: ${maxLossAmount} ${currencySymbol}`],
                   [`Montant de plus-value potentielle maximale: ${maxGainAmount} ${currencySymbol}`]
                ],
                 widths: ['*']
            },
           layout: 'noBorders',
            fontSize: 10,
            margin: [0, 0, 0, 10]
        };
    }

    function getResultsWithCapping() {
       const resultsWithCapping = document.getElementById('resultsWithCapping');
       if (!resultsWithCapping) {
            return {};
        }
         // Formattez les nombres avec des espaces pour les milliers
        const portfolioValueEcreteAvecGain = formatNumber(document.getElementById('portfolioValueEcreteAvecGain').textContent.replace(/\s/g, ''));
        const finalPortfolioValueEcrete = formatNumber(document.getElementById('finalPortfolioValueEcrete').textContent.replace(/\s/g, ''));
         const finalTotalEcrete = formatNumber(document.getElementById('finalTotalEcrete').textContent.replace(/\s/g, ''));
         const finalTotalEcreteInterest = formatNumber(document.getElementById('finalTotalEcreteInterest').textContent.replace(/\s/g, ''));
         let finalGainEcrete = document.getElementById('finalGainEcrete').textContent;
        if(finalGainEcrete) {
            finalGainEcrete = (parseFloat(finalGainEcrete.replace(/\s/g, '').replace(',', '.').replace('%', ''))/10).toString()
        }
       const maxLossAmountEcrete = formatNumber(document.getElementById('finalMaxLossAmountEcrete').textContent);
        const maxGainAmountEcrete = formatNumber(document.getElementById('finalMaxGainAmountEcrete').textContent);
         const currencySymbol =  document.getElementById('currencySymbolLabel').textContent;
        return {
            table: {
                body: [
                     [`Valeur portefeuille + Gain sécurisé: ${portfolioValueEcreteAvecGain} ${currencySymbol}`],
                    [`Valeur finale du portefeuille écrêté: ${finalPortfolioValueEcrete} ${currencySymbol}`],
                     [`Valeur totale écrêtée: ${finalTotalEcrete} ${currencySymbol}`],
                   [`Valeur totale des intérêts des gains écrêtés: ${finalTotalEcreteInterest} ${currencySymbol}`],
                     [
                         {
                            text: [
                                'Gain ou Perte: ',
                               { text: formatPercentage(finalGainEcrete), style: getStyleForValue(finalGainEcrete) }
                           ],
                         }
                     ],
                     [`Montant de moins-value potentielle maximale: ${maxLossAmountEcrete} ${currencySymbol}`],
                    [`Montant de plus-value potentielle maximale: ${maxGainAmountEcrete} ${currencySymbol}`]
                ],
                widths: ['*']
            },
            layout: 'noBorders',
           fontSize: 10,
           margin: [0, 0, 0, 10]
        };
    }
    function getSecuredGainsTable() {
        const securedGainsTableBody = document.getElementById('securedGainsTableBody');
        if (!securedGainsTableBody) {
            return {};
        }
         let securedGainTableData = [];
        const header = ['Date', 'Gain sécurisé', 'Intérêt du gain sécurisé']
        const rows = securedGainsTableBody.querySelectorAll('tr');
          rows.forEach(row => {
            let rowData = [];
             const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                rowData.push(cell.textContent);
            });
            if (rowData.length > 0) {
              securedGainTableData.push(rowData);
            }
        });
        return {
            table: {
                 body: [
                     [
                       { text: 'Date', style: 'tableHeader' },
                         { text: 'Gain sécurisé', style: 'tableHeader' },
                       { text: 'Intérêt du gain sécurisé', style: 'tableHeader' }
                    ],
                   ...securedGainTableData.map(row => [
                       { text: row[0], style: 'tableCell' },
                        { text: formatNumber(row[1]), style: getStyleForValue(row[1]) },
                      { text: formatNumber(row[2]), style: getStyleForValue(row[2]) }
                    ])
                ],
                widths: ['auto', 'auto', '*']
         },
        margin: [0, 0, 0, 10]
       };
    }
    function getChartWithBorder(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            return {};
        }
        const remToPx = 16; // Conversion simple rem to px
        return {
            table: {
                body: [[
                    {
                        image: canvas.toDataURL('image/png'),
                        width: 500,
                        alignment: 'center',
                    }
               ]],
              widths: ['*']
            },
            layout: {
                 hLineWidth: function (i, node) {
                    return 1;
                },
               vLineWidth: function (i, node) {
                    return 1;
               },
               hLineColor: function(i, node) {
                   return 'black';
                 },
                vLineColor: function (i, node) {
                   return 'black';
               },
               paddingLeft: function(i, node) { return 1 * remToPx; },
                paddingRight: function(i, node) { return 1 * remToPx; },
                paddingTop: function(i, node) { return 1 * remToPx; },
               paddingBottom: function(i, node) { return 1 * remToPx; },
          },
          style: 'chartContainer'
        };
    }
    function getStyleForValue(value) {
      const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
         if (!isNaN(numericValue)) {
              return numericValue >= 0 ? 'positive' : 'negative';
       }
    }
   function formatNumber(numberString) {
    // Supprimer tous les espaces et les virgules existants pour ne garder que la partie numérique
        let number = numberString.replace(/\s/g, '').replace(',', '.');
         // Convertir la chaîne de caractères en nombre
         number = parseFloat(number);
         // Vérifier si la valeur est bien un nombre
         if (isNaN(number)) {
             return numberString; // Retourne la valeur d'origine si ce n'est pas un nombre
         }
          const formattedNumber = number.toFixed(2);
          const parts = formattedNumber.split('.');
         parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
         return parts.join(',');
   }

     function formatPercentage(numberString) {
       // Supprimer tous les espaces et les virgules existants pour ne garder que la partie numérique
        let number = numberString.replace(/\s/g, '').replace(',', '.').replace('%','');
         // Convertir la chaîne de caractères en nombre
        number = parseFloat(number);
       // Vérifier si la valeur est bien un nombre
         if (isNaN(number)) {
           return numberString; // Retourne la valeur d'origine si ce n'est pas un nombre
        }
        return number.toFixed(2).replace('.', ',') + ' %'
    }
}
window.generatePDF = generatePDF;
