import { useState } from 'react';
import BootstrappingTab from './components/BootstrappingTab.jsx';
import MergerOfEqualsTab from './components/MergerOfEqualsTab.jsx';

// Show one finance tool at a time using a small stateful tab switcher.
export default function App() {
  const [activeTab, setActiveTab] = useState('bootstrapping');
  return <main className="page-shell">
    <header className="site-header"><div className="brand-mark">M<span>+</span></div><div><p className="eyebrow">A M&amp;A classroom tool</p><h1>Merger Reality Check</h1></div></header>
    <section className="intro"><p className="eyebrow">Look beyond the headline</p><h2>Does the deal create value—or just change the numbers?</h2><p>Explore two common merger claims with simple, illustrative inputs.</p></section>
    <nav className="tabs" aria-label="Choose a calculator">
      <button className={activeTab === 'bootstrapping' ? 'tab active' : 'tab'} onClick={() => setActiveTab('bootstrapping')} aria-current={activeTab === 'bootstrapping' ? 'page' : undefined}>01 <span>Bootstrapping</span></button>
      <button className={activeTab === 'equals' ? 'tab active' : 'tab'} onClick={() => setActiveTab('equals')} aria-current={activeTab === 'equals' ? 'page' : undefined}>02 <span>Merger of equals</span></button>
    </nav>
    {activeTab === 'bootstrapping' ? <BootstrappingTab /> : <MergerOfEqualsTab />}
    <footer>Merger Reality Check <span>Illustrative educational model · Not investment advice</span></footer>
  </main>;
}
