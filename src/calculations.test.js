import assert from 'node:assert/strict';
import { calculateBootstrapping, calculateMergerOfEquals } from './calculations.js';

// Check the stated default example and boundary cases for the bootstrapping formula.
const base = { earningsA: 100, sharesA: 10, peA: 12, earningsB: 100, sharesB: 10, peB: 8, premiumPercent: 0, sharesPercent: 100 };
const bootstrap = calculateBootstrapping(base);
assert.equal(bootstrap.marketValueA, 1200);
assert.equal(bootstrap.marketValueB, 800);
assert.equal(bootstrap.sharePriceA, 120);
assert.equal(bootstrap.sharePriceB, 80);
assert.ok(Math.abs(bootstrap.newShares - 6.6666666667) < 1e-8);
assert.ok(Math.abs(bootstrap.combinedShares - 16.6666666667) < 1e-8);
assert.equal(bootstrap.proFormaEps, 12);
assert.equal(bootstrap.standaloneEps, 10);
assert.ok(Math.abs(bootstrap.accretionPercent - 20) < 1e-10);
assert.equal(bootstrap.afterTaxSynergies, 0);
assert.equal(bootstrap.combinedValue, 2000);
assert.equal(bootstrap.valueCreated, 0);
assert.equal(bootstrap.changeInAShareholderWealth, 0);
// 20 in annual pre-tax synergies leaves 15 after tax and produces the stated EPS and wealth gain.
const withSynergies = calculateBootstrapping({ ...base, annualPretaxSynergies: 20, taxRate: 25, valuationMethod: 'blended' });
assert.equal(withSynergies.afterTaxSynergies, 15);
assert.ok(Math.abs(withSynergies.proFormaEps - 12.9) < 1e-10);
assert.equal(withSynergies.combinedValue, 2150);
assert.equal(withSynergies.valueCreated, 150);
assert.ok(Math.abs(withSynergies.changeInAShareholderWealth - 90) < 1e-10);
// Using A's 12x multiple increases the assumed market value of the combined earnings.
const buyerMultiple = calculateBootstrapping({ ...base, annualPretaxSynergies: 20, taxRate: 25, valuationMethod: 'buyer' });
assert.equal(buyerMultiple.valuationPe, 12);
assert.equal(buyerMultiple.combinedValue, 2580);
// Zero synergies keep the original EPS and accretion results.
const zeroSynergies = calculateBootstrapping({ ...base, annualPretaxSynergies: 0, taxRate: 25, valuationMethod: 'blended' });
assert.equal(zeroSynergies.proFormaEps, bootstrap.proFormaEps);
assert.equal(zeroSynergies.accretionPercent, bootstrap.accretionPercent);
// An all-cash consideration amount issues no shares in this simple model.
const cashOnly = calculateBootstrapping({ ...base, sharesPercent: 0 });
assert.equal(cashOnly.newShares, 0);
assert.equal(cashOnly.combinedShares, 10);
// Equal P/E ratios produce no EPS accretion without a premium.
const equalPe = calculateBootstrapping({ ...base, peA: 10, peB: 10 });
assert.equal(equalPe.accretionPercent, 0);
// A 100% premium doubles the purchase amount and new shares issued.
const premium = calculateBootstrapping({ ...base, premiumPercent: 100 });
assert.equal(premium.purchasePrice, 1600);
assert.ok(Math.abs(premium.newShares - 13.3333333333) < 1e-8);

// Check the stated merger example and several ownership outcomes.
const merger = calculateMergerOfEquals({ marketValueA: 100, marketValueB: 100, premiumPercent: 20 });
assert.ok(Math.abs(merger.ownershipB - 0.54545454545) < 1e-10);
assert.ok(Math.abs(merger.ownershipA - 0.45454545455) < 1e-10);
const noPremium = calculateMergerOfEquals({ marketValueA: 100, marketValueB: 100, premiumPercent: 0 });
assert.equal(noPremium.ownershipA, 0.5);
assert.equal(noPremium.ownershipB, 0.5);
const largerA = calculateMergerOfEquals({ marketValueA: 300, marketValueB: 100, premiumPercent: 0 });
assert.equal(largerA.ownershipA, 0.75);
assert.equal(largerA.ownershipB, 0.25);
console.log('All calculation tests passed.');
