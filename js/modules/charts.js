export function updateSavingsChart(labels, investments, portfolio, monthlyInterestRate) {
    const ctxSavings = document.getElementById('savingsChart').getContext('2d');
     let cumulativeSavings = 0;
     let savingsData = [];
     let totalInvestments = 0; // Ajout pour calculer le total des investissements

     for (let i = 0; i < labels.length; i++) {
         if (i === 0) {
            cumulativeSavings = investments[i];
            savingsData.push(0);
         }else {
             cumulativeSavings = cumulativeSavings * (1 + monthlyInterestRate) + (investments[i]-investments[i-1]);
             savingsData.push(cumulativeSavings - investments[i]);
         }
        totalInvestments += investments[i]; // Accumuler les investissements
     }
    const finalAmount = cumulativeSavings;
    const totalInterest = finalAmount - totalInvestments; // Calcul de l'intérêt total
    
    if (savingsChart) savingsChart.destroy();
     savingsChart = new Chart(ctxSavings, {
          type: 'bar',
         data: {
             labels: labels,
             datasets: [{
                     label: 'Montant investi',
                     data: investments,
                     backgroundColor: 'rgb(0, 255, 0)',
                     borderColor: 'rgb(0, 255, 0)',
                     borderWidth: 1,
                     stack: 'stack1',
                     yAxisID: 'y',
                     order : 2
                 },
                 {
                     label: 'Gain taux fixe',
                     data: savingsData,
                     backgroundColor: 'rgb(0, 0, 255)',
                     stack: 'stack1',
                     yAxisID: 'y',
                     order : 3
                 },
                  {
                    label: 'Valeur du Portefeuille',
                    data: portfolio,
                    type: 'line',
                    borderColor: 'rgb(255, 135, 0)',
                    tension: 0.1,
                     yAxisID: 'y',
                     order : 1
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
      return { totalInterest, finalAmount };
}
