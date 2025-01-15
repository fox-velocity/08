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
        pageMargins: [15, 15, 15, 70],
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
footer: function(currentPage, pageCount) {
    return {
        table: {
            widths: ['*', 'auto', '*'],
            body: [
                [
                    {
                        text: 'Fox Velocity',
                        alignment: 'center',
                        fontSize: 8,
                        margin: [0, 0, 0, 0]
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
                         margin: [0, 0, 0, 0]
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
                  if(isChartReady){
                       setTimeout(resolve, 100)
                  }else {
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
    const totalInvested = document.getElementById('finalTotalInvested').textContent
    const investmentDuration = document.getElementById('finalNumberOfPayments').textContent
    const stockChangePercentage = document.getElementById('finalStockChangePercentage').textContent
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
   const initialInvestment = document.getElementById('initialInvestment').value;
    const monthlyInvestment = document.getElementById('monthlyInvestment').value;
    const interestRate = document.getElementById('interestRate').value;  
    const cappingPercentage = document.getElementById('cappingPercentage').value;
    const minCappingAmount = document.getElementById('minCappingAmount').value;
    const currencySymbol =  document.getElementById('currencySymbolLabel').textContent;



    return {
        table: {
             body: [
                [`Total investi: ${totalInvested}`],
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
          const portfolioValue = document.getElementById('finalPortfolioValue').textContent;
          const finalGainLossPercentage = document.getElementById('finalGainLossPercentage').textContent;
          const maxLossAmount = document.getElementById('finalMaxLossAmount').textContent;
          const maxGainAmount = document.getElementById('finalMaxGainAmount').textContent;
        return {
            table: {
                 body: [
                      [`Valeur finale du portefeuille: ${portfolioValue}`],
                      [
                         {
                            text: [
                                 'Gain ou Perte: ',
                               { text: finalGainLossPercentage, style: getStyleForValue(finalGainLossPercentage) }
                             ],
                        }
                      ],
                     [`Montant de moins-value potentielle maximale: ${maxLossAmount}`],
                     [`Montant de plus-value potentielle maximale: ${maxGainAmount}`]
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
         const portfolioValueEcreteAvecGain = document.getElementById('portfolioValueEcreteAvecGain').textContent;
           const finalPortfolioValueEcrete = document.getElementById('finalPortfolioValueEcrete').textContent;
          const finalTotalEcrete = document.getElementById('finalTotalEcrete').textContent;
           const finalTotalEcreteInterest = document.getElementById('finalTotalEcreteInterest').textContent;
          const finalGainEcrete = document.getElementById('finalGainEcrete').textContent;
           const maxLossAmountEcrete = document.getElementById('finalMaxLossAmountEcrete').textContent;
        const maxGainAmountEcrete = document.getElementById('finalMaxGainAmountEcrete').textContent;

         return {
            table: {
                 body: [
                      [`Valeur portefeuille + Gain sécurisé: ${portfolioValueEcreteAvecGain}`],
                      [`Valeur finale du portefeuille écrêté: ${finalPortfolioValueEcrete}`],
                    [`Valeur totale écrêtée: ${finalTotalEcrete}`],
                      [`Valeur totale des intérêts des gains écrêtés: ${finalTotalEcreteInterest}`],
                       [
                          {
                              text: [
                                  'Gain ou Perte: ',
                                   { text: finalGainEcrete, style: getStyleForValue(finalGainEcrete) }
                               ], 
                           }
                       ],
                      [`Montant de moins-value potentielle maximale: ${maxLossAmountEcrete}`],
                    [`Montant de plus-value potentielle maximale: ${maxGainAmountEcrete}`]
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
                         { text: row[0], style: 'tableCell'},
                        { text: row[1], style: getStyleForValue(row[1]) },
                       { text: row[2], style: getStyleForValue(row[2])}
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
            } else {
               const valueTest = value.replace(/<[^>]*>/g, '')
              const numericValueTest = parseFloat(valueTest.replace(/[^\d.-]/g, ''));
                 return numericValueTest >= 0 ? 'positive' : 'negative';
            }
        }
}
window.generatePDF = generatePDF; // Ajout pour exposer generatePDF
