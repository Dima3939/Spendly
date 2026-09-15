const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');
c = c.replace(/borderRadius: '8px',\s*boxShadow: 'var\(--shadow-glow\)'/g, '');
fs.writeFileSync('src/App.jsx', c, 'utf8');

let s = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf8');
s = s.replace(/borderRadius: '8px',\s*boxShadow: '0 0 15px rgba\(21, 214, 119, 0\.2\)'/g, '');
fs.writeFileSync('src/layouts/Sidebar.jsx', s, 'utf8');
