const fs = require('fs');

let c = fs.readFileSync('src/components/PeriodSetup.jsx', 'utf8');

c = "import CurrencySwitcher from './CurrencySwitcher';\n" + c;

// The mobile version might have a slightly different wrapper because of positioning.
// Let's replace the native select in PeriodSetup.jsx.
// In PeriodSetup.jsx:
// <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-primary)', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', appearance: 'none', padding: '0 5px' }}> <option value="₴">₴</option> <option value="$">$</option> <option value="€">€</option> <option value="£">£</option> <option value="¥">¥</option> <option value="₽">₽</option> </select>

c = c.replace(/<select[\s\S]*?<\/select>/, `<div style={{ position: 'relative', width: '40px', height: '40px' }}><CurrencySwitcher currency={currency} setCurrency={setCurrency} /></div>`);

fs.writeFileSync('src/components/PeriodSetup.jsx', c, 'utf8');
console.log('PeriodSetup uses CurrencySwitcher now.');
