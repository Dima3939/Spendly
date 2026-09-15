const fs = require('fs');

let c = fs.readFileSync('src/pages/WebTransactions.jsx', 'utf8');

if (!c.includes('exportTransactionsToCSV')) {
    c = "import { exportTransactionsToCSV } from '../utils/exportCsv';\n" + c;
}

// Ensure the button calls the export logic
c = c.replace(
  /<button\s+style=\{\{[\s\S]*?\}\}\s*>\s*<ArrowDownToLine size=\{18\} \/>\s*Export CSV\s*<\/button>/,
  `<button onClick={() => { if (isPro) { exportTransactionsToCSV(expenses, currency); } else { upgradeToPro(); } }} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
              <ArrowDownToLine size={18} />
              Export CSV {!isPro && <span style={{ fontSize: '0.65rem', background: 'var(--accent-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>PRO</span>}
            </button>`
);

// We need `isPro`, `upgradeToPro`, `currency`, `expenses` from props.
// export default function WebTransactions({ currentPeriod, currency, ...rest })
// In App.jsx, <WebTransactions {...webContext} /> so it receives them all.
c = c.replace(
  "export default function WebTransactions({ currentPeriod, currency }) {",
  "export default function WebTransactions({ currentPeriod, currency, isPro, upgradeToPro, expenses }) {"
);

fs.writeFileSync('src/pages/WebTransactions.jsx', c, 'utf8');
console.log('Fixed Export CSV in WebTransactions');
