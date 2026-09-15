const fs = require('fs');

let c = fs.readFileSync('src/components/WebPeriodSetup.jsx', 'utf8');

c = c.replace(
  "export default function WebPeriodSetup({ onPeriodCreated, currency }) {",
  "export default function WebPeriodSetup({ onPeriodCreated, currency, setCurrency }) {"
);

const oldSpan = `<span style={{ 
                position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', 
                color: 'var(--accent-primary)', fontWeight: '800', fontSize: '1.25rem' 
              }}>
                {currency}
              </span>`;

const newSelect = `<select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                style={{ 
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', 
                  color: 'var(--accent-primary)', fontWeight: '800', fontSize: '1.25rem',
                  background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer',
                  appearance: 'none', padding: '0 10px'
                }}
              >
                <option value="₴">₴ UAH</option>
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
                <option value="£">£ GBP</option>
                <option value="¥">¥ JPY</option>
                <option value="₽">₽ RUB</option>
              </select>`;

c = c.replace(oldSpan, newSelect);
fs.writeFileSync('src/components/WebPeriodSetup.jsx', c, 'utf8');
console.log('WebPeriodSetup updated.');
