const fs = require('fs');
let c = fs.readFileSync('src/i18n.js', 'utf8');
c = c.replace("lng: 'en',", "lng: localStorage.getItem('spendly_lang') || 'en',");
fs.writeFileSync('src/i18n.js', c, 'utf8');
console.log("i18n.js language persistence added.");
