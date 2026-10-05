# Merger Reality Check

Merger Reality Check is a small classroom website about two ways a deal headline can hide what is happening underneath. It uses illustrative numbers to show that EPS can rise because of a difference in valuation multiples, and that a premium changes who owns the combined company.

## The two tools

### Bootstrapping simulator

Market value = earnings × P/E. Share price = market value ÷ shares. The purchase price is the target's market value plus the premium. New buyer shares = the share-funded portion of the purchase price ÷ the buyer's share price. Pro forma EPS = combined earnings ÷ combined shares. EPS accretion = pro forma EPS ÷ buyer standalone EPS − 1. Cash consideration is ignored in this simple model. With the default inputs, EPS rises 20% because A's 12× P/E shares acquire earnings priced at B's 8× P/E.

### Merger of equals tester

Value offered to B = B's market value × (1 + premium). B holders' ownership = value offered ÷ (A's market value + value offered). A holders own the remainder. A majority is treated as an acquisition in the ownership test. Governance and control can also depend on the board, chair, and management roles.

The specification gives a “close to equal” band of 45%–55%, but also says the default 54.55% / 45.45% ownership split must be called an acquisition. Those rules conflict. The app resolves this by calling a tie a close merger of equals and a strict majority an acquisition; the default is therefore an acquisition by B's shareholders.

## Run locally

Install a current Node.js LTS release, then from the project folder run:

```sh
npm install
npm run dev
```

Run the calculation checks with `npm test`, create the production site with `npm run build`, and preview it locally with `npm run preview`.

## Project structure

```text
merger-reality-check/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── calculations.js
    ├── calculations.test.js
    └── components/
        ├── BootstrappingTab.jsx
        └── MergerOfEqualsTab.jsx
```

## Deploy with GitHub and Vercel

1. Create a new empty repository on GitHub named `merger-reality-check`.
2. In a terminal, open this project folder and run `git init -b main`, `git add .`, and `git commit -m "Build Merger Reality Check"`.
3. Copy the repository's HTTPS address from GitHub. Run `git remote add origin <your-repository-url>` and `git push -u origin main`.
4. Sign in to Vercel, choose **Add New → Project**, and import the GitHub repository (authorize GitHub if prompted).
5. Set **Framework Preset** to **Vite**. Leave the build command as `npm run build` and output directory as `dist`, then select **Deploy**.
6. Vercel builds the site and gives you a URL. Future pushes to `main` trigger a new deployment.

## Learning limits

All values are user-entered and illustrative. This is not a full transaction valuation: it excludes financing costs, taxes, synergies, purchase accounting, fractional-share handling, dilution from other securities, and market reactions. The first tool ignores cash paid when calculating combined shares and EPS. The second tool treats ownership as a simple proxy for control; legal agreements and governance can change actual control.
