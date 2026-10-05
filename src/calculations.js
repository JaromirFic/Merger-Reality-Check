// Calculate acquisition EPS, synergy value, and the change in A holders' wealth.
export function calculateBootstrapping({ earningsA, sharesA, peA, earningsB, sharesB, peB, premiumPercent, sharesPercent, annualPretaxSynergies = 0, taxRate = 25, valuationMethod = 'blended' }) {
  const marketValueA = earningsA * peA;
  const marketValueB = earningsB * peB;
  const sharePriceA = marketValueA / sharesA;
  const sharePriceB = marketValueB / sharesB;
  const purchasePrice = marketValueB * (1 + premiumPercent / 100);
  const stockValue = purchasePrice * (sharesPercent / 100);
  const newShares = stockValue / sharePriceA;
  const afterTaxSynergies = annualPretaxSynergies * (1 - taxRate / 100);
  const combinedEarnings = earningsA + earningsB + afterTaxSynergies;
  const combinedShares = sharesA + newShares;
  const standaloneEps = earningsA / sharesA;
  const proFormaEps = combinedEarnings / combinedShares;
  const accretionPercent = (proFormaEps / standaloneEps - 1) * 100;
  const blendedPe = (marketValueA + marketValueB) / (earningsA + earningsB);
  const valuationPe = valuationMethod === 'buyer' ? peA : blendedPe;
  const combinedValue = combinedEarnings * valuationPe;
  const valueCreated = combinedValue - marketValueA - marketValueB;
  const buyerOwnership = sharesA / combinedShares;
  const changeInAShareholderWealth = buyerOwnership * combinedValue - marketValueA;
  return { marketValueA, marketValueB, sharePriceA, sharePriceB, purchasePrice, stockValue, newShares, afterTaxSynergies, combinedEarnings, combinedShares, standaloneEps, proFormaEps, accretionPercent, blendedPe, valuationPe, combinedValue, valueCreated, buyerOwnership, changeInAShareholderWealth };
}

// Calculate the ownership split after offering B holders a premium in combined-company shares.
export function calculateMergerOfEquals({ marketValueA, marketValueB, premiumPercent }) {
  const valueOffered = marketValueB * (1 + premiumPercent / 100);
  const combinedValue = marketValueA + valueOffered;
  const ownershipB = valueOffered / combinedValue;
  const ownershipA = 1 - ownershipB;
  return { valueOffered, combinedValue, ownershipA, ownershipB };
}
