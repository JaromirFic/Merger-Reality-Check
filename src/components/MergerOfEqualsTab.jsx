import { useState } from 'react';
import { calculateMergerOfEquals } from '../calculations.js';

// Format an ownership ratio as a percentage unless the calculation is invalid.
function percent(value) { return Number.isFinite(value) ? `${(value * 100).toFixed(2)}%` : '—'; }

// Render one editable number with a unit suffix.
function Field({ label, value, onChange, suffix, max }) {
  return <label className="field"><span>{label}</span><span className="input-wrap"><input type="number" min="0" max={max} step="any" value={value} onChange={(event) => onChange(event.target.value)} /><span>{suffix}</span></span></label>;
}

// Validate the market values and premium before passing values to the calculation.
function validate(values) {
  if (Object.values(values).some((value) => String(value).trim() === '')) return 'Enter a valid number in every field.';
  const parsed = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value)]));
  if (Object.values(parsed).some((value) => !Number.isFinite(value))) return 'Enter a valid number in every field.';
  if (parsed.marketValueA <= 0 || parsed.marketValueB <= 0) return 'Both market values must be greater than zero.';
  if (parsed.premiumPercent < 0 || parsed.premiumPercent > 500) return 'Premium must be between 0% and 500%.';
  if (Object.values(calculateMergerOfEquals(parsed)).some((value) => !Number.isFinite(value))) return 'These inputs create a result too large to calculate safely.';
  return { parsed };
}

// Render the ownership calculator and describe which shareholder group has a majority.
export default function MergerOfEqualsTab() {
  const [values, setValues] = useState({ marketValueA: '100', marketValueB: '100', premiumPercent: '20' });
  const checked = validate(values);
  const result = checked.parsed ? calculateMergerOfEquals(checked.parsed) : null;
  const update = (key) => (value) => setValues((current) => ({ ...current, [key]: value }));
  const bMajority = result && result.ownershipB > 0.5;
  const aMajority = result && result.ownershipA > 0.5;
  // The 45–55% close range conflicts with the required default acquisition verdict; majority takes precedence.
  const verdict = result && !bMajority && !aMajority
    ? 'Close to a true merger of equals on ownership. Now check governance: chairman, board seats, who runs operations.'
    : `This is really an acquisition. ${bMajority ? "B's shareholders" : "A's shareholders"} end up with the majority.`;

  return <>
    <section className="tool-heading"><div><p className="eyebrow">Tool 02 · Share exchange</p><h2>Who really owns the combined company?</h2><p>A premium changes the ownership split. Follow the shares to see which side gains control on paper.</p></div><span className="tool-index">02 / 02</span></section>
    <div className="calculator-grid">
      <section className="panel input-panel"><div className="panel-heading"><div><p className="eyebrow">Set your assumptions</p><h3>Ownership inputs</h3></div><span className="unit-note">Illustrative units</span></div>
        <div className="company-grid"><div className="company-card"><h4><span className="company-dot a" />Company A</h4><Field label="Market value" value={values.marketValueA} onChange={update('marketValueA')} suffix="units" /></div><div className="company-card"><h4><span className="company-dot b" />Company B</h4><Field label="Market value" value={values.marketValueB} onChange={update('marketValueB')} suffix="units" /></div></div>
        <div className="deal-inputs single-input"><Field label="Premium offered to B shareholders" value={values.premiumPercent} onChange={update('premiumPercent')} suffix="%" max="500" /><small>Paid fully in shares of the combined company. Allowed range: 0%–500%.</small></div>
        {typeof checked === 'string' && <p className="error-message" role="alert">{checked}</p>}
      </section>
      <section className="panel result-panel" aria-live="polite"><div className="panel-heading"><div><p className="eyebrow">The numbers behind the deal</p><h3>Ownership split</h3></div><span className="result-chip">Share exchange</span></div>
        {result && <><div className="ownership-bar" aria-label={`A holders ${percent(result.ownershipA)}, B holders ${percent(result.ownershipB)}`}><span style={{ width: percent(result.ownershipA) }} /><span style={{ width: percent(result.ownershipB) }} /></div>
          <div className="ownership-legend"><div><span className="company-dot a" />A holders<strong>{percent(result.ownershipA)}</strong></div><div><span className="company-dot b" />B holders<strong>{percent(result.ownershipB)}</strong></div></div>
          <div className="result-list"><ResultRow label="Value offered to B holders" value={result.valueOffered.toLocaleString('en-US', { maximumFractionDigits: 2 })} /><ResultRow label="Combined value for exchange" value={result.combinedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })} /></div>
          <p className={bMajority || aMajority ? 'insight warning' : 'insight'}>{verdict}</p><p className="control-note">Ownership is not everything. Control also depends on who is chairman, for how long, and which executives benefit from the deal.</p></>}
      </section>
    </div>
    <details className="formula-details"><summary>How this is calculated</summary><p>Value offered to B holders = B's market value × (1 + premium). B holders' ownership = value offered ÷ (A's market value + value offered). A holders own the remainder. A strict majority is treated as an acquisition in this simple ownership test.</p></details>
    <p className="threshold-note">Threshold note: the brief's 45%–55% “close to equal” range includes the default 54.55% / 45.45% split, while it also requires that default to be called an acquisition. These rules conflict. This tool follows the majority ownership result, so the default verdict is an acquisition by B's shareholders.</p>
  </>;
}

// Show a named ownership calculation and its value in the results list.
function ResultRow({ label, value }) { return <div className="result-row"><span>{label}</span><b>{value}</b></div>; }
