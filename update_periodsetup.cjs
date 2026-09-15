const fs = require('fs');

let c = fs.readFileSync('src/components/PeriodSetup.jsx', 'utf8');

c = c.replace(
  "export default function PeriodSetup({ onPeriodCreated }) {",
  "export default function PeriodSetup({ onPeriodCreated, currency, setCurrency }) {"
);

const oldSpan = `<span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              ₴
            </span>`;

const newSelect = `<select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              style={{ 
                fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-primary)',
                background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer',
                appearance: 'none', padding: '0 5px'
              }}
            >
              <option value="₴">₴</option>
              <option value="$">$</option>
              <option value="€">€</option>
              <option value="£">£</option>
              <option value="¥">¥</option>
              <option value="₽">₽</option>
            </select>`;

c = c.replace(oldSpan, newSelect);
c = c.replace(/\{val\.toLocaleString\('ru-RU'\)\}\s*₴/g, "{val.toLocaleString('ru-RU')} {currency}");

fs.writeFileSync('src/components/PeriodSetup.jsx', c, 'utf8');
console.log('PeriodSetup updated.');
