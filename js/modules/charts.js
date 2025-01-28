// charts.js

const { Chart } = window;

let evolutionChart = null;
let investmentChart = null;
let savingsChart = null;

// Fonction pour mettre à jour le graphique d'évolution
export function updateEvolutionChart(labels, prices) {
    const ctxEvolution = document.getElementById('evolutionChart').getContext('2d');
    if (evolutionChart) evolutionChart.destroy();
    // Graphique de l'évolution du support choisi
     evolutionChart = new Chart(ctxEvolution, {
       type: 'line',
       data: {
           labels: labels,
           datasets: [
               {
                   label: 'Prix du support',
                   data: prices,
                   borderColor: 'rgb(0, 0, 255)',
                   tension: 0.1,
                   yAxisID: 'y',
                   order: 1
               }
           ]
       },
       options: {
          responsive: true,
           maintainAspectRatio: false,
           plugins: {
               title: {
                   display: true,
                   text: 'Évolution du support choisi',
                   font: {
                       size: 25
                   },
                   color: 'black' // pour les caractères du titre
               },
               legend: {
                   labels: {
                       color: 'black' // Couleur noire pour les textes des légendes
                   }
               }
           },
           scales: {
               y: {
                   ticks: {
                       color: 'black'
                   }
               },
               x: {
                   ticks: {
                       color: 'black'
                   }
               }
           }
       }
   });
}

// Fonction pour mettre à jour le graphique des montants investis et de l'évolution du portefeuille
export function updateInvestmentChart(labels, investments, portfolio, portfolioValueEcreteAvecGain) {
     const ctxInvestment = document.getElementById('investmentChart').getContext('2d');
     if (investmentChart) investmentChart.destroy();
     // Graphique des montants investis et de l'évolution du portefeuille
     investmentChart = new Chart(ctxInvestment, {
         type: 'bar',
         data: {
             labels: labels,
             datasets: [
                 {
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
                 },
             ]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false,
             plugins: {
                 title: {
                     display: true,
                     text: 'Montants investis et évolution du portefeuille',
                     font: {
                         size: 25
                     },
                     color: 'black' // pour les caractères du titre
                 },
                 legend: {
                     labels: {
                         color: 'black' // Couleur noire pour les textes des légendes
                     }
                 }
             },
             scales: {
                 y: {
                     beginAtZero: true,
                     ticks: {
                         color: 'black'
                     }
                 },
                 x: {
                     ticks: {
                         color: 'black'
                     }
                 }
             }
         }
     });
}

export function updateSavingsChart(labels, investments, portfolio, monthlyInterestRate) {
    const ctxSavings = document.getElementById('savingsChart').getContext('2d');
    let cumulativeSavingsFix3 = 0;
    let savingsDataFix3 = [];
    let totalInvestmentsFix3 = 0;
    let investmentDataFix3 = [];
    let totalInterestFix3 = 0;

    console.log("Début du calcul du placement à taux fixe");

    for (let i = 0; i < labels.length; i++) {
        if (i === 0) {
            cumulativeSavingsFix3 = investments[i];
            savingsDataFix3.push(0);
        } else {
            cumulativeSavingsFix3 = cumulativeSavingsFix3 * (1 + monthlyInterestRate) + (investments[i] - investments[i - 1]);
            savingsDataFix3.push(cumulativeSavingsFix3 - investments[i]);
        }
         totalInvestmentsFix3 += investments[i];
        investmentDataFix3.push(investments[i]);
       
        console.log(`Mois ${i + 1}:`);
        console.log(`  Investissement: ${investments[i]}`);
        console.log(`  cumulativeSavingsFix3: ${cumulativeSavingsFix3}`);
         console.log(`  savingsDataFix3: ${savingsDataFix3[i]}`);
         console.log(`  totalInvestmentsFix3: ${totalInvestmentsFix3}`);
    }

    const finalAmountFix3 = cumulativeSavingsFix3;
    totalInterestFix3 = finalAmountFix3 - totalInvestmentsFix3;
     console.log("Fin du calcul du placement à taux fixe");
    console.log(`  Valeur finale du portefeuille: ${finalAmountFix3}`);
    console.log(`  Total des intérêts: ${totalInterestFix3}`);


    if (savingsChart) savingsChart.destroy();
    savingsChart = new Chart(ctxSavings, {
         type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                    label: 'Montant investi',
                    data: investmentDataFix3,
                    backgroundColor: 'rgb(0, 255, 0)',
                    borderColor: 'rgb(0, 255, 0)',
                    borderWidth: 1,
                    stack: 'stack1',
                    yAxisID: 'y',
                    order: 2
                },
                {
                    label: 'Gain taux fixe',
                    data: savingsDataFix3,
                    backgroundColor: 'rgb(0, 0, 255)',
                    stack: 'stack1',
                    yAxisID: 'y',
                    order: 3
                },
                {
                    label: 'Valeur du Portefeuille',
                    data: portfolio,
                    type: 'line',
                    borderColor: 'rgb(255, 135, 0)',
                    tension: 0.1,
                    yAxisID: 'y',
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparatif : Taux fixe VS Épargne sur un véhicule financier',
                    font: {
                        size: 25
                    },
                    color: 'black'
                },
                legend: {
                    labels: {
                        color: 'black'
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    beginAtZero: true,
                    stacked: true,
                    position: 'bottom',
                    ticks: {
                        color: 'black'
                    }
                },
                x: {
                    ticks: {
                        color: 'black'
                    }
                }
            }
        }
    });
    return { totalInterest: totalInterestFix3, finalAmount: finalAmountFix3 };
}
