import { useState } from 'react';
import { calculateBootstrapping } from '../calculations.js';

const defaults = { earningsA: '100', sharesA: '10', peA: '12', earningsB: '100', sharesB: '10', peB: '8', premiumPercent: '0', sharesPercent: '100', annualPretaxSynergies: '0', taxRate: '25', valuationMethod: 'blended' };

// Render one labelled numeric input and call onChange when its value changes.
function NumberField({ label, value, onChange, max, suffix, hint }) {
  return <label className="field"><span>{label}</span><span className="input-wrap"><input type="number" inputMode="decimal" min="0" max={max} step="any" value={value} onChange={(event) => onChange(event.target.value)} /><span>{suffix}</span></span>{hint && <small>{hint}</small>}</label>;
}

// Format a finite result and use a dash if the number is invalid.
function format(value, digits = 2) {
  return Number.isFinite(value) ? value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }) : '—';
}

// Check all fields before calculations so invalid inputs never create NaN or Infinity in the UI.
function validate(values) {
  if (Object.values(values).some((value) => String(value).trim() === '')) return 'Enter a valid number in every field.';
  const parsed = Object.fromEntries(Object.entries(values)
    .filter(([key]) => key !== 'valuationMethod')
    .map(([key, value]) => [key, Number(value)]));
  parsed.valuationMethod = values.valuationMethod;
  if (Object.entries(parsed).some(([key, value]) => key !== 'valuationMethod' && !Number.isFinite(value))) return 'Enter a valid number in every field.';
  if (['earningsA', 'sharesA', 'peA', 'earningsB', 'sharesB', 'peB'].some((key) => parsed[key] <= 0)) return 'Earnings, shares, and P/E ratios must all be greater than zero.';
  if (parsed.premiumPercent < 0 || parsed.premiumPercent > 500) return 'Premium must be between 0% and 500%.';
  if (parsed.sharesPercent < 0 || parsed.sharesPercent > 100) return 'The share-funded portion must be between 0% and 100%.';
  if (parsed.annualPretaxSynergies < 0) return 'Annual pre-tax synergies cannot be negative.';
  if (parsed.taxRate < 0 || parsed.taxRate > 100) return 'Tax rate must be between 0% and 100%.';
  const result = calculateBootstrapping(parsed);
  if (Object.values(result).some((value) => !Number.isFinite(value)) || result.sharePriceA <= 0) return 'These inputs create a result too large or too small to calculate safely.';
  return { parsed };
}

// Render deal inputs, validated EPS results, and formula notes for the bootstrapping example.
export default function BootstrappingTab() {
  const [values, setValues] = useState(defaults);
  const checked = validate(values);
  const result = checked.parsed ? calculateBootstrapping(checked.parsed) : null;
  const update = (key) => (value) => setValues((current) => ({ ...current, [key]: value }));
  const isBootstrap = result && result.accretionPercent > 0 && checked.parsed.peA > checked.parsed.peB;
  let message = '';
  if (result && result.afterTaxSynergies > 0) {
    message = `After-tax synergies add ${format(result.afterTaxSynergies)} to earnings. At ${format(result.valuationPe, 1)}×, that changes the combined value by ${format(result.valueCreated)} versus the two standalone companies, and A shareholders' wealth changes by ${format(result.changeInAShareholderWealth)}.`;
  } else if (result && isBootstrap) {
    message = "EPS goes up only because A's shares are valued at a higher P/E than B's. No real value has been created unless the market keeps valuing the combined earnings at A's high P/E.";
  } else if (result && checked.parsed.peA <= checked.parsed.peB) {
    message = "This is not bootstrapping: A's P/E is lower than or equal to B's, so EPS may be flat or dilutive.";
  } else if (result) {
    message = "A's higher P/E does not make this deal accretive at these inputs; the purchase premium or share mix may be too high.";
  }

  return <>
    <section className="tool-heading"><div><p className="eyebrow">Tool 01 · Share-funded acquisition</p><h2>The EPS illusion</h2><p>A high-multiple buyer can report higher EPS after buying a lower-multiple target, even without creating real value.</p></div><span className="tool-index">01 / 02</span></section>
    <div className="calculator-grid">
      <section className="panel input-panel"><div className="panel-heading"><div><p className="eyebrow">Set your assumptions</p><h3>Deal inputs</h3></div><span className="unit-note">Illustrative units</span></div>
        <div className="company-grid">
          <div className="company-card"><h4><span className="company-dot a" />Buyer A</h4><NumberField label="Net income" value={values.earningsA} onChange={update('earningsA')} suffix="units" /><NumberField label="Shares outstanding" value={values.sharesA} onChange={update('sharesA')} suffix="shares" /><NumberField label="P/E ratio" value={values.peA} onChange={update('peA')} suffix="×" /></div>
          <div className="company-card"><h4><span className="company-dot b" />Target B</h4><NumberField label="Net income" value={values.earningsB} onChange={update('earningsB')} suffix="units" /><NumberField label="Shares outstanding" value={values.sharesB} onChange={update('sharesB')} suffix="shares" /><NumberField label="P/E ratio" value={values.peB} onChange={update('peB')} suffix="×" /></div>
        </div>
        <div className="deal-inputs"><NumberField label="Premium paid over B's market value" value={values.premiumPercent} onChange={update('premiumPercent')} suffix="%" max="500" hint="Allowed range: 0%–500%" /><NumberField label="Purchase paid in shares" value={values.sharesPercent} onChange={update('sharesPercent')} suffix="%" max="100" hint="Cash consideration is ignored in EPS." /></div>
        <section className="synergy-section"><h4>Synergies and combined company value</h4><div className="deal-inputs three-inputs">
          <NumberField label="Annual pre-tax synergies" value={values.annualPretaxSynergies} onChange={update('annualPretaxSynergies')} suffix="units / year" hint="Default: 0" />
          <NumberField label="Tax rate" value={values.taxRate} onChange={update('taxRate')} suffix="%" max="100" hint="Allowed range: 0%–100%" />
          <label className="field"><span>Combined company P/E</span><span className="select-wrap"><select value={values.valuationMethod} onChange={(event) => update('valuationMethod')(event.target.value)}><option value="blended">Blended P/E</option><option value="buyer">A's P/E</option></select></span><small>Blended P/E is the default.</small></label>
        </div></section>
        {typeof checked === 'string' && <p className="error-message" role="alert">{checked}</p>}
      </section>
      <section className="panel result-panel" aria-live="polite"><div className="panel-heading"><div><p className="eyebrow">The numbers behind the deal</p><h3>Pro forma result</h3></div><span className="result-chip">EPS check</span></div>
        {result && <><div className="headline-result"><div><span>EPS accretion / (dilution)</span><strong className={result.accretionPercent >= 0 ? 'positive' : 'negative'}>{result.accretionPercent >= 0 ? '+' : ''}{format(result.accretionPercent, 1)}%</strong></div><div className="eps-compare"><span>Standalone EPS</span><b>{format(result.standaloneEps)}</b><span>Pro forma EPS</span><b>{format(result.proFormaEps)}</b></div></div>
          <div className="result-list"><ResultRow label="Market value · Buyer A" value={format(result.marketValueA)} /><ResultRow label="Market value · Target B" value={format(result.marketValueB)} /><ResultRow label="Share price · A / B" value={`${format(result.sharePriceA)} / ${format(result.sharePriceB)}`} /><ResultRow label="Price paid for B" value={format(result.purchasePrice)} /><ResultRow label="Paid in shares" value={format(result.stockValue)} /><ResultRow label="New A shares issued" value={format(result.newShares, 3)} /><ResultRow label="After-tax synergies" value={format(result.afterTaxSynergies)} /><ResultRow label="Combined earnings" value={format(result.combinedEarnings)} /><ResultRow label="Combined shares" value={format(result.combinedShares, 3)} /><ResultRow label="P/E used for combined value" value={`${format(result.valuationPe, 2)}×`} /><ResultRow label="Combined value" value={format(result.combinedValue)} /><ResultRow label="Value created / (lost)" value={format(result.valueCreated)} /><ResultRow label="Change in A holders' wealth" value={format(result.changeInAShareholderWealth)} /></div>
          <p className={isBootstrap ? 'insight warning' : 'insight'}>{message}</p></>}
      </section>
    </div>
    <p className="valuation-note">The blended P/E is the combined standalone market values divided by their combined earnings. Choosing A's P/E assumes the market will value all combined earnings at A's higher multiple. That can change the perceived combined value even though the synergy cash flow stays the same.</p>
    <details className="formula-details"><summary>How this is calculated</summary><p>Market value = net income × P/E. Share price = market value ÷ shares. Purchase price = B's market value × (1 + premium). New shares = purchase price × share-funded percentage ÷ A's share price. After-tax synergies = pre-tax synergies × (1 − tax rate). Pro forma EPS = (A earnings + B earnings + after-tax synergies) ÷ combined shares. Combined value = combined earnings × selected P/E. Value created = combined value − A market value − B market value. A holders' wealth change = A's share of the new shares × combined value − A's original market value. Cash consideration is ignored.</p></details>
  </>;
}

// Show a named calculation and its formatted value in the results list.
function ResultRow({ label, value }) { return <div className="result-row"><span>{label}</span><b>{value}</b></div>; }
