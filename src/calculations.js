// Calculate values and per-share results for a share-funded acquisition.
export function calculateBootstrapping({ earningsA, sharesA, peA, earningsB, sharesB, peB, premiumPercent, sharesPercent }) {
  const marketValueA = earningsA * peA;
  const marketValueB = earningsB * peB;
  const sharePriceA = marketValueA / sharesA;
  const sharePriceB = marketValueB / sharesB;
  const purchasePrice = marketValueB * (1 + premiumPercent / 100);
  const stockValue = purchasePrice * (sharesPercent / 100);
  const newShares = stockValue / sharePriceA;
  const combinedEarnings = earningsA + earningsB;
  const combinedShares = sharesA + newShares;
  const standaloneEps = earningsA / sharesA;
  const proFormaEps = combinedEarnings / combinedShares;
  const accretionPercent = (proFormaEps / standaloneEps - 1) * 100;
  return { marketValueA, marketValueB, sharePriceA, sharePriceB, purchasePrice, stockValue, newShares, combinedEarnings, combinedShares, standaloneEps, proFormaEps, accretionPercent };
}

// Calculate the ownership split after offering B holders a premium in combined-company shares.
export function calculateMergerOfEquals({ marketValueA, marketValueB, premiumPercent }) {
  const valueOffered = marketValueB * (1 + premiumPercent / 100);
  const combinedValue = marketValueA + valueOffered;
  const ownershipB = valueOffered / combinedValue;
  const ownershipA = 1 - ownershipB;
  return { valueOffered, combinedValue, ownershipA, ownershipB };
}
