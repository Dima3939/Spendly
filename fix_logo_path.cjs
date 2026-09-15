const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');
c = c.replace(/src="\/logo\.svg"/g, 'src="./logo.svg"');
fs.writeFileSync('src/App.jsx', c, 'utf8');

let s = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf8');
s = s.replace(/src="\/logo\.svg"/g, 'src="./logo.svg"');
fs.writeFileSync('src/layouts/Sidebar.jsx', s, 'utf8');
