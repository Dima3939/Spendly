const fs = require('fs');
let c = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf8');

c = c.replace("export default function Sidebar({ onLogout }) {", "export default function Sidebar({ onLogout, isPro }) {");

const proBadge = "Spendly</span>\n          {isPro && <span style={{ fontSize: '0.65rem', background: 'var(--accent-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800', marginLeft: '8px' }}>PRO</span>}";
c = c.replace(/Spendly<\/span>/, proBadge);

fs.writeFileSync('src/layouts/Sidebar.jsx', c, 'utf8');
