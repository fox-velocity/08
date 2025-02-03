// pdf.js 23 12 31 01 mais le 01 02
export async function generatePDF(pdfMake, logoBase64, logoRenardBase64Gris) {
    if (!pdfMake) {
        alert('pdfMake n\'est pas disponible');
        console.error("pdfMake n'est pas chargé");
        return;
    }

    await waitForChart('investmentChart');

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [15, 15, 15, 50],
        background: function (currentPage, pageSize) {
            return {
                image: logoRenardBase64Gris,
                width: pageSize.width * 0.9,
                height: pageSize.height * 0.9,
                absolutePosition: {
                    x: (pageSize.width - pageSize.width * 0.9) / 2,
                    y: (pageSize.height - pageSize.height * 0.9) / 2
                },
                opacity: 0.2,
            };
        },
        content: [
            { text: 'Simulateur de Rendement d\'Investissement', style: 'title' },
            { text: 'Informations sur l\'instrument financier', style: 'subtitle' },
            getStockInfo(),
            { text: 'Synthèse investissement', style: 'subtitle' },
            getChartWithBorder('evolutionChart'),
            getTopResults(),
            {
                text: 'Résultats', style: 'subtitle', pageBreak: 'before'
            },
            getResults(),
            {
                text: 'Résultats avec écrêtage des gains', style: 'subtitle'
            },
            getResultsWithCapping(),
            getSecuredGainsTable(),
            { text: 'Résultats épargne placée à taux garanti', style: 'subtitle' },
            getResultsTauxFixe(),
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
                margin: [0, 10, 10, 15]
            },
            paragraph: {
                fontSize: 8,
                alignment: 'justify',
                margin: [10, 20, 10, 10]
            },
            tableHeader: {
                bold: true,
                fillColor: '#dddddd',
                margin: [15, 5, 0, 5]
            },
            tableCell: {
                margin: [0, 0, 0, 0]
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

    // Création du pdf avec un nom de fichier personnalisé
    const stockData = getStockInfo();
    const fileName = generateFileName(stockData.stockSymbol);
    pdfMake.createPdf(docDefinition).download(fileName);

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
                    [`Nom : ${stockName}`],
                    [`Symbole : ${stockSymbol}`],
                    [`Devise : ${stockCurrency}`],
                    [`Place de Cotation : ${stockExchange}`],
                    [`Type : ${stockType}`],
                    [`Industrie : ${stockIndustry}`]
                ],
                widths: ['*']
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 10],
            stockSymbol: stockSymbol // on retourne aussi le stockSymbol
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
        const currencySymbol = document.getElementById('currencySymbolLabel').textContent;

        return {
            table: {
                body: [
                    [`Total investi : ${totalInvested} ${currencySymbol}`],
                    [`Durée investissement : ${investmentDuration}`],
                    [
                        {
                            text: [
                                'Évolution instrument financier : ',
                                { text: stockChangePercentage, style: getStyleForValue(stockChangePercentage) }
                            ],
                        }
                    ],
                    [`Date de début : ${startDate}`],
                    [`Date de fin : ${endDate}`],
                    [`Versement initial : ${initialInvestment} ${currencySymbol}`],
                    [`Montant mensuel investi : ${monthlyInvestment} ${currencySymbol}`],
                    [""], // Ligne vide ajoutée
                    [`Réglage des options :`],
                    [` * limite seuil d'écrêtage : ${cappingPercentage * 100} %`],
                    [` * Valeurs limite seuil d'écrêtage : ${minCappingAmount}`],
                    [` * Taux d'intérêt annuel : ${interestRate * 100} %`],
                ],
                widths: ['*']
            },
            layout: 'noBorders',
            margin: [0, 0, 0, 10],
        };
    }

    function getResults() {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) {
            return {};
        }
        const finalPortfolioValue = formatNumber(document.getElementById('finalPortfolioValue').textContent.replace(/\s/g, ''));
        const finalGainLossPercentage = document.getElementById('finalGainLossPercentage').textContent;
        const finalGainLossAmount = formatNumber(document.getElementById('finalGainLossPercentage').textContent.replace(/\s/g, '').replace('%', ''));
        const finalMaxLossAmount = formatNumber(document.getElementById('finalMaxLossAmount').textContent.replace(/\s/g, ''));
        const finalMaxGainAmount = formatNumber(document.getElementById('finalMaxGainAmount').textContent.replace(/\s/g, ''));
        const currencySymbol = document.getElementById('currencySymbolLabel').textContent;
        return {
            table: {
                body: [
                    [
                        { text: `Valeur finale du portefeuille :`, alignment: 'left' },
                        { text: `${finalPortfolioValue} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalPortfolioValue) }
                    ],
                    [
                        { text: `Gain ou Perte :`, alignment: 'left' },
                        { text: `${finalGainLossAmount} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalGainLossAmount) }
                    ],
                    [
                        { text: `Moins-value potentielle maximale :`, alignment: 'left' },
                        { text: `${finalMaxLossAmount} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalMaxLossAmount) }
                    ],
                    [
                        { text: `Plus-value potentielle maximale :`, alignment: 'left' },
                        { text: `${finalMaxGainAmount} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalMaxGainAmount) }
                    ]
                ],
                widths: ['50%', '50%']
            },
            layout: 'noBorders',
            fontSize: 12,
            margin: [0, 0, 0, 10]
        };
    }

    function getResultsWithCapping() {
        const resultsWithCappingDiv = document.getElementById('resultsWithCapping');
        if (!resultsWithCappingDiv) {
            return {};
        }
        const portfolioValueEcreteAvecGain = formatNumber(document.getElementById('portfolioValueEcreteAvecGain').textContent.replace(/\s/g, ''));
        const finalPortfolioValueEcrete = formatNumber(document.getElementById('finalPortfolioValueEcrete').textContent.replace(/\s/g, ''));
        const finalTotalEcrete = formatNumber(document.getElementById('finalTotalEcrete').textContent.replace(/\s/g, ''));
        const finalTotalEcreteInterest = formatNumber(document.getElementById('finalTotalEcreteInterest').textContent.replace(/\s/g, ''));
        const finalGainEcrete = formatNumber(document.getElementById('finalGainEcrete').textContent.replace(/\s/g, ''));
        const finalMaxLossAmountEcrete = formatNumber(document.getElementById('finalMaxLossAmountEcrete').textContent.replace(/\s/g, ''));
        const finalMaxGainAmountEcrete = formatNumber(document.getElementById('finalMaxGainAmountEcrete').textContent.replace(/\s/g, ''));
        const currencySymbol = document.getElementById('currencySymbolLabel').textContent;
        return {
            table: {
                body: [
                    [
                        { text: `Valeur portefeuille + Gain sécurisé :`, alignment: 'left' },
                        { text: `${portfolioValueEcreteAvecGain} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(portfolioValueEcreteAvecGain) }
                    ],
                    [
                        { text: `Valeur finale du portefeuille écrêté :`, alignment: 'left' },
                        { text: `${finalPortfolioValueEcrete} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalPortfolioValueEcrete) }
                    ],
                    [
                        { text: `Valeur totale écrêtée :`, alignment: 'left' },
                        { text: `${finalTotalEcrete} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalTotalEcrete) }
                    ],
                    [
                        { text: `Valeur totale des intérêts des gains écrêtés :`, alignment: 'left' },
                        { text: `${finalTotalEcreteInterest} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalTotalEcreteInterest) }
                    ],
                    [
                        { text: `Gain ou Perte :`, alignment: 'left' },
                        { text: `${finalGainEcrete} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalGainEcrete) }
                    ],
                    [
                        { text: `Moins-value potentielle maximale :`, alignment: 'left' },
                        { text: `${finalMaxLossAmountEcrete} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalMaxLossAmountEcrete) }
                    ],
                    [
                        { text: `Plus-value potentielle maximale :`, alignment: 'left' },
                        { text: `${finalMaxGainAmountEcrete} ${currencySymbol}`, alignment: 'right', style: getStyleForValue(finalMaxGainAmountEcrete) }
                    ]
                ],
                widths: ['50%', '50%']
            },
            layout: 'noBorders',
            fontSize: 12,
            margin: [0, 0, 0, 10]
        };
    }
    //table des gains sécurisé   
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
                        { text: ' ' },
                        { text: 'Date', style: 'tableHeader', alignment: 'center' },
                        { text: 'Gain sécurisé', style: 'tableHeader', alignment: 'center' },
                        { text: 'Intérêt du gain sécurisé', style: 'tableHeader', alignment: 'center' }
                    ],
                    ...securedGainTableData.map(row => [
                        { text: '' },
                        { text: row[0], style: 'tableCell', alignment: 'center' },
                        { text: formatNumber(row[1]), style: getStyleForValue(row[1]), alignment: 'center' },
                        { text: formatNumber(row[2]), style: getStyleForValue(row[2]), alignment: 'right' }
                    ])
                ],
                widths: ['15%', '20%', '20%', '30%'],
            },
            layout: 'noBorders',
        };

    }

    // Fonction pour récupérer les données du tableau résultats épargne placée à taux garanti
    function getResultsTauxFixe() {
        const resultsTauxFixe = document.getElementById('resultsTauxFix');
        if (!resultsTauxFixe) {
            return {};
        }
        const lastCumulativeSavingsText = formatNumber(document.getElementById('last-cumulative-savings')?.textContent?.replace(/\s/g, '') || '-');
        const lastInvestmentText = formatNumber(document.getElementById('last-investment')?.textContent?.replace(/\s/g, '') || '-');
        const gainTauxFixeText = formatNumber(document.getElementById('gain-taux-fixe')?.textContent?.replace(/\s/g, '') || '-');
        const totalInterestText = document.getElementById('totalInterest')?.textContent || '-';
        const currencySymbol = document.getElementById('currencySymbolLabel')?.textContent || '';

        return {
            table: {
                body: [
                    [
                        { text: `Valeur finale du portefeuille :`, alignment: 'left' },
                        { text: `${lastCumulativeSavingsText} ${currencySymbol}`, alignment: 'right' }
                    ],
                    [
                        { text: `Montant versé :`, alignment: 'left' },
                        { text: `${lastInvestmentText} ${currencySymbol}`, alignment: 'right' }
                    ],
                    [
                        { text: `Total des intérêts :`, alignment: 'left' },
                        { text: `${gainTauxFixeText} ${currencySymbol}`, alignment: 'right' }
                    ],
                    [
                        { text: `Taux d'intérêt annuel :`, alignment: 'left' },
                        { text: totalInterestText, alignment: 'right' }
                    ]
                ],
                widths: ['30%', 'auto']  // On définit explicitement la largeur de la première colonne à 30%
            },
            layout: 'noBorders',
            fontSize: 12,
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
                hLineColor: function (i, node) {
                    return 'black';
                },
                vLineColor: function (i, node) {
                    return 'black';
                },
                paddingLeft: function (i, node) { return 1 * remToPx; },
                paddingRight: function (i, node) { return 1 * remToPx; },
                paddingTop: function (i, node) { return 1 * remToPx; },
                paddingBottom: function (i, node) { return 1 * remToPx; },
            },
            style: 'chartContainer'
        };
    }

    function getStyleForValue(value, isPercentage) {
        const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
        if (!isNaN(numericValue)) {
            return numericValue >= 0 ? 'positive' : 'negative';
        } else {
            const valueTest = value.replace(/<[^>]*>/g, '')
            const numericValueTest = parseFloat(valueTest.replace(/[^\d.-]/g, ''));
            if (isPercentage) {
                return numericValueTest >= 0 ? 'positive' : 'negative';
            } else {
                return numericValueTest >= 0 ? 'positive' : 'negative';
            }
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
        let number = numberString.replace(/\s/g, '').replace(',', '.').replace('%', '');
        // Convertir la chaîne de caractères en nombre
        number = parseFloat(number);
        // Vérifier si la valeur est bien un nombre
        if (isNaN(number)) {
            return numberString; // Retourne la valeur d'origine si ce n'est pas un nombre
        }
        return number.toFixed(2).replace('.', ',') + ' %';
    }
    // Fonction pour générer le nom du fichier
    function generateFileName(stockSymbol) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${hours}${minutes}${seconds}`;
        return `${formattedDate}-${formattedTime}-${stockSymbol}-FoxVelocity.pdf`;
    }
}
window.generatePDF = generatePDF;
