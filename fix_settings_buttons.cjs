const fs = require('fs');
let c = fs.readFileSync('src/pages/WebSettings.jsx', 'utf8');

c = c.replace(/\{t\('add'\) \|\| 'Save'\}/g, "{t('save', 'Save')}");
c = c.replace(/>\s*Cancel\s*</g, ">{t('cancel', 'Cancel')}<");

fs.writeFileSync('src/pages/WebSettings.jsx', c, 'utf8');
