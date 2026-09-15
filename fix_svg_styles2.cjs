const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');
c = c.replace("borderRadius: '8px',\n                boxShadow: 'var(--shadow-glow)'", "");
c = c.replace("borderRadius: '8px',\r\n                boxShadow: 'var(--shadow-glow)'", "");
fs.writeFileSync('src/App.jsx', c, 'utf8');

let s = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf8');
s = s.replace("borderRadius: '8px',\n              boxShadow: '0 0 15px rgba(21, 214, 119, 0.2)'", "");
s = s.replace("borderRadius: '8px',\r\n              boxShadow: '0 0 15px rgba(21, 214, 119, 0.2)'", "");
fs.writeFileSync('src/layouts/Sidebar.jsx', s, 'utf8');
