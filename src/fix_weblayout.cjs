const fs = require('fs');
let content = fs.readFileSync('layouts/WebLayout.jsx', 'utf8');

// replace both options to ensure correct UTF-8 strings
content = content.replace(/<option value="en"[\s\S]*?<\/option>/, `<option value="en" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>English</option>`);
content = content.replace(/<option value="ru"[\s\S]*?<\/option>/, `<option value="ru" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Русский</option>`);

fs.writeFileSync('layouts/WebLayout.jsx', content, 'utf8');
console.log('Fixed WebLayout encoding');
