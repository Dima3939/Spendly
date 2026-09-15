const fs = require('fs');

let c = fs.readFileSync('src/components/WebTransactionModal.jsx', 'utf8');

if (!c.includes('parseSmartInput')) {
    c = "import { parseSmartInput } from '../utils/smartParser';\n" + c;
}

// Add state
c = c.replace(
  "const [type, setType] = useState('expense');",
  "const [type, setType] = useState('expense');\n  const [smartInput, setSmartInput] = useState('');"
);

// Add smartInput handler
const handlerCode = `
  const handleSmartInputChange = (e) => {
    const val = e.target.value;
    setSmartInput(val);
    
    if (val.length > 2) {
      const parsed = parseSmartInput(val);
      if (parsed.amount) setAmount(parsed.amount);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.description) setTitle(parsed.description); // Web uses 'title' for description/merchant
    }
  };
`;

c = c.replace(
  "const handleSubmit = (e) => {",
  handlerCode + "\n  const handleSubmit = (e) => {"
);

// Clear on submit
c = c.replace(
  "setTitle('');",
  "setTitle('');\n    setSmartInput('');"
);

// Inject UI right before Scan Receipt Placeholder
const smartUI = `
          {/* AI Smart Input */}
          <div style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(21, 214, 119, 0.1) 0%, transparent 100%)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>🤖</span> Smart Input
            </label>
            <input 
              type="text" 
              placeholder="e.g. Taxi 15, Coffee 5..."
              value={smartInput}
              onChange={handleSmartInputChange}
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                padding: '12px 16px',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Type your expense naturally. We'll fill the form below automatically!
            </div>
          </div>
`;

c = c.replace(
  /\{\/\* Scan Receipt Placeholder \*\/\}/,
  smartUI + "\n          {/* Scan Receipt Placeholder */}"
);

fs.writeFileSync('src/components/WebTransactionModal.jsx', c, 'utf8');
console.log('Fixed Smart Input in WebTransactionModal');
