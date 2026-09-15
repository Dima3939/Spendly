const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(/setUser\r?\n\s*\};/, 'setUser,\n      isPro,\n      upgradeToPro\n    };');
fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('Fixed webContext');
