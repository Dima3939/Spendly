const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const proBadge = `{t('appName')}
              {isPro && <span style={{ fontSize: '0.65rem', background: 'var(--accent-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800', marginLeft: '6px', verticalAlign: 'middle' }}>PRO</span>}
            </h1>`;

c = c.replace(/\{t\('appName'\)\}\s*<\/h1>/, proBadge);

fs.writeFileSync('src/App.jsx', c, 'utf8');
