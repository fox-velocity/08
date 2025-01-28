// data.js

export function calculateInvestmentData(timestamps, prices, initialInvestment, monthlyInvestment, cappingPercentage, minCappingAmount, monthlyInterestRate, guaranteedInterestRate) {
    let totalInvested = initialInvestment;
    let totalShares = initialInvestment / prices[0];
    let numberOfPayments = initialInvestment > 0 ? 1 : 0;
    let maxLossAmount = 0;
    let maxLossPercentage = 0;
    let maxGainAmount = 0;
    let maxGainPercentage = 0;
    let maxLossDate = '';
    let maxGainDate = '';

    let totalInvestedEcrete = initialInvestment;
    let totalSharesEcrete = initialInvestment / prices[0];
    let totalSharesSoldEcrete = 0;
    let securedGains = 0;
    let securedGainsInterest = 0; // Variable pour les intérêts générés
    let cappedDatesAndAmounts = [];
    let cappedDatesAndAmountsWithInterest = []; // Tableau pour stocker les dates d'écrêtage avec les intérêts

    let maxLossAmountEcrete = 0;
    let maxLossPercentageEcrete = 0;
    let maxGainAmountEcrete = 0;
    let maxGainPercentageEcrete = 0;
    let maxLossDateEcrete = '';
    let maxGainDateEcrete = '';

    let totalInvestedGuaranteed = initialInvestment; // Pour le capital investi à taux garanti
    let totalInterestGuaranteed = 0; // Pour les intérêts garantis cumulés

    const chartData = {
        labels: [],
        prices: [],
        investments: [],
        portfolio: [],
        sharesBought: [],
        totalShares: [],
        portfolioValueEcreteSansGain: [],
        totalSharesSoldEcrete: [],
        totalSharesEcrete: [],
        securedGains: [],
        portfolioValueEcrete: [],
        portfolioValueEcreteAvecGain: [],
        securedGainsInterest: [], //Ajout des interet générer
         totalInvestedEcreteHistory: [],
        totalInvestedGuaranteed:[], // Ajout du suivi de l'investissement garanti
         totalInterestGuaranteed:[] // Ajout du suivi des intérêts cumulés de l'investissement garanti
    };

      const filteredData = [];
  const firstDays = new Set();
  for (let i = 0; i < timestamps.length; i++) {
      const currentDate = new Date(timestamps[i] * 1000);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);

      if (currentDate.toDateString() === firstDayOfMonth.toDateString()) {
          if (!firstDays.has(firstDayOfMonth.toDateString())) {
              filteredData.push({ date: currentDate, price: prices[i] });
              firstDays.add(firstDayOfMonth.toDateString());
          }
      }
  }
    let lastCappedMonth = null;
  filteredData.forEach((data, index) => {
      const dateString = data.date.toISOString().split('T')[0];
      chartData.labels.push(dateString);
      chartData.prices.push(data.price);

      if (index < filteredData.length - 1) {
         // Investissement classique
          totalInvested += monthlyInvestment;
          const sharesBought = monthlyInvestment / data.price;
          totalShares += sharesBought;
          numberOfPayments++;
          chartData.sharesBought.push(sharesBought);
        // Investissement écrêté
          totalInvestedEcrete += monthlyInvestment;
          const sharesBoughtEcrete = monthlyInvestment / data.price;
          totalSharesEcrete += sharesBoughtEcrete;

          const portfolioValueEcreteSansGain = totalSharesEcrete * data.price;
          const gainAmountEcrete = portfolioValueEcreteSansGain - totalInvestedEcrete;
          const gainPercentageEcrete = (gainAmountEcrete / totalInvestedEcrete) * 100;

            if (gainAmountEcrete >= minCappingAmount && gainPercentageEcrete > (cappingPercentage * 100)) {
               securedGains += gainAmountEcrete;
                const unitsToSell = gainAmountEcrete / data.price;
                 totalSharesEcrete -= unitsToSell;
                 totalSharesSoldEcrete += unitsToSell;
                cappedDatesAndAmounts.push({ date: dateString, amount: gainAmountEcrete.toFixed(2) });
                cappedDatesAndAmountsWithInterest.push({ date: dateString, amount: gainAmountEcrete, interest:0 });
                 lastCappedMonth = dateString;
            }
        if (lastCappedMonth && securedGains > 0) {
            let interestToAdd = 0
              cappedDatesAndAmountsWithInterest.forEach(item => {
                   if(item.date < dateString){
                       const dateCapped = new Date(item.date);
                      const dateCurrent = new Date(dateString)
                      const monthDiff = (dateCurrent.getFullYear() - dateCapped.getFullYear()) * 12 + (dateCurrent.getMonth() - dateCapped.getMonth())
                      const interest = item.amount * (Math.pow(1 + monthlyInterestRate, monthDiff) - 1);
                       item.interest = interest
                        interestToAdd += interest;
                  }
             })
           securedGainsInterest = interestToAdd;
          }
           chartData.totalSharesSoldEcrete.push(totalSharesSoldEcrete);
          chartData.totalSharesEcrete.push(totalSharesEcrete);
          chartData.securedGains.push(securedGains);
          chartData.securedGainsInterest.push(securedGainsInterest); // Ajouter les intérêts au tableau
           chartData.portfolioValueEcreteSansGain.push(portfolioValueEcreteSansGain);

          // Calculer portfolioValueEcrete après l'écrêtage
           const portfolioValueEcrete = totalSharesEcrete * data.price;
          chartData.portfolioValueEcrete.push(portfolioValueEcrete);

           // Calculer portfolioValueEcreteAvecGain
          const portfolioValueEcreteAvecGain = portfolioValueEcrete + securedGains + securedGainsInterest;
          chartData.portfolioValueEcreteAvecGain.push(portfolioValueEcreteAvecGain);
           chartData.totalInvestedEcreteHistory.push(totalInvestedEcrete);
          
          // Calcul des intérêts pour l'investissement à taux garanti
        const monthlyGuaranteedInterest = (totalInvestedGuaranteed * guaranteedInterestRate) / 12; // Taux annuel divisé par 12 pour un taux mensuel
        totalInterestGuaranteed += monthlyGuaranteedInterest;
        totalInvestedGuaranteed += monthlyInvestment + monthlyGuaranteedInterest;  // Ajouter l'investissement mensuel et les intérêts garantis
        chartData.totalInvestedGuaranteed.push(totalInvestedGuaranteed);
        chartData.totalInterestGuaranteed.push(totalInterestGuaranteed);

      } else {
          chartData.sharesBought.push(0);
          chartData.totalSharesSoldEcrete.push(totalSharesSoldEcrete);
          chartData.totalSharesEcrete.push(totalSharesEcrete);
          const portfolioValueEcreteSansGain = totalSharesEcrete * data.price;
           chartData.securedGains.push(securedGains);
           chartData.securedGainsInterest.push(securedGainsInterest); // Ajouter les intérêts au tableau
           chartData.portfolioValueEcreteSansGain.push(portfolioValueEcreteSansGain);

           // Calculer portfolioValueEcrete après l'écrêtage
          const portfolioValueEcrete = totalSharesEcrete * data.price;
          chartData.portfolioValueEcrete.push(portfolioValueEcrete);

          // Calculer portfolioValueEcreteAvecGain
           const portfolioValueEcreteAvecGain = portfolioValueEcrete + securedGains + securedGainsInterest;
           chartData.portfolioValueEcreteAvecGain.push(portfolioValueEcreteAvecGain);
          chartData.totalInvestedEcreteHistory.push(totalInvestedEcrete);
         // Calcul des intérêts pour l'investissement à taux garanti
        const monthlyGuaranteedInterest = (totalInvestedGuaranteed * guaranteedInterestRate) / 12; // Taux annuel divisé par 12 pour un taux mensuel
        totalInterestGuaranteed += monthlyGuaranteedInterest;
        totalInvestedGuaranteed += monthlyGuaranteedInterest;  // Ajouter les intérêts garantis
        chartData.totalInvestedGuaranteed.push(totalInvestedGuaranteed);
        chartData.totalInterestGuaranteed.push(totalInterestGuaranteed);
      }


      chartData.totalShares.push(totalShares);
      chartData.investments.push(totalInvested);
      chartData.portfolio.push(totalShares * data.price);

      const currentLossAmount = totalInvested - (totalShares * data.price);
      const currentLossPercentage = (currentLossAmount / totalInvested) * 100;
      const currentGainAmount = (totalShares * data.price) - totalInvested;
      const currentGainPercentage = (currentGainAmount / totalInvested) * 100;
      if (currentLossAmount > maxLossAmount) {
          maxLossAmount = currentLossAmount;
          maxLossPercentage = currentLossPercentage;
          maxLossDate = new Date(dateString).toISOString().split('T')[0];
      }
      if (currentGainAmount > maxGainAmount) {
          maxGainAmount = currentGainAmount;
          maxGainPercentage = currentGainPercentage;
          maxGainDate = new Date(dateString).toISOString().split('T')[0];
      }
        // Calcul de la moins value et plus value maximale du portefeuille écrêter
        const currentLossAmountEcrete = totalInvestedEcrete - chartData.portfolioValueEcrete[index];
        const currentLossPercentageEcrete = (currentLossAmountEcrete / totalInvestedEcrete) * 100;
        const currentGainAmountEcrete = chartData.portfolioValueEcrete[index] - totalInvestedEcrete;
        const currentGainPercentageEcrete = (currentGainAmountEcrete / totalInvestedEcrete) * 100;
       const currentGainLossEcreteAvecGain =  chartData.securedGains[index] + chartData.securedGainsInterest[index] + (chartData.portfolioValueEcrete[index] - chartData.totalInvestedEcreteHistory[index]);

         if (currentGainLossEcreteAvecGain < 0 && Math.abs(currentGainLossEcreteAvecGain) > Math.abs(maxLossAmountEcrete)) {
            maxLossAmountEcrete = currentGainLossEcreteAvecGain;
            maxLossDateEcrete = new Date(dateString).toISOString().split('T')[0];
             maxLossPercentageEcrete = (currentGainLossEcreteAvecGain / totalInvestedEcrete) * 100
       }
        if (currentGainAmountEcrete > maxGainAmountEcrete) {
            maxGainAmountEcrete = currentGainAmountEcrete;
            maxGainPercentageEcrete = currentGainPercentageEcrete;
            maxGainDateEcrete = new Date(dateString).toISOString().split('T')[0];
        }
  });
   const lastPrice = filteredData[filteredData.length - 1].price;
  const gainLossPercentage = ((totalShares * lastPrice - totalInvested) / totalInvested) * 100;
    const gainLossAmount = (totalShares * lastPrice - totalInvested);
  const stockChangePercentage = ((lastPrice - filteredData[0].price) / filteredData[0].price) * 100;
    // Portefeuille écrêté
  const finalPortfolioValueEcrete = totalSharesEcrete * lastPrice;
  const finalPortfolioValueEcreteAvecGain = finalPortfolioValueEcrete + securedGains + securedGainsInterest;
   const finalGainLossAmountEcrete = finalPortfolioValueEcreteAvecGain - totalInvestedEcrete;
    const finalGainLossPercentageEcrete = (finalGainLossAmountEcrete / totalInvestedEcrete) * 100;
  const results = {
          totalInvested,
         numberOfPayments,
         stockChangePercentage,
          portfolioValue: (totalShares * lastPrice),
          gainLossPercentage,
          gainLossAmount,
          maxLossAmount,
          maxLossPercentage,
          maxGainAmount,
          maxGainPercentage,
         maxLossDate,
          maxGainDate,
           finalPortfolioValueEcrete,
         finalPortfolioValueEcreteAvecGain,
          securedGains,
          securedGainsInterest,
          finalGainLossAmountEcrete,
           finalGainLossPercentageEcrete,
           maxLossAmountEcrete,
          maxLossPercentageEcrete,
           maxGainAmountEcrete,
          maxGainPercentageEcrete,
           maxLossDateEcrete,
          maxGainDateEcrete,
           totalInterestGuaranteed,
            totalInvestedGuaranteed
  }
     return { chartData, cappedDatesAndAmountsWithInterest, results };
}
