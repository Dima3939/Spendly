const fs = require('fs');
let c = fs.readFileSync('src/pages/WebTransactions.jsx', 'utf8');
c = c.replace("placeholder=t('searchPlaceholder')", "placeholder={t('searchPlaceholder')}");
fs.writeFileSync('src/pages/WebTransactions.jsx', c, 'utf8');
console.log("Fixed.");
