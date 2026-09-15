const fs = require('fs');

let c = fs.readFileSync('src/components/QuickExpenseModal.jsx', 'utf8');

if (!c.includes('import { parseSmartInput }')) {
    c = "import { parseSmartInput } from '../utils/smartParser';\n" + c;
}

// Add state for smart input
c = c.replace(
  "const [description, setDescription] = useState('');",
  "const [description, setDescription] = useState('');\n  const [smartInput, setSmartInput] = useState('');"
);

// Add smart input change handler
const smartInputHandler = `
  const handleSmartInputChange = (e) => {
    const val = e.target.value;
    setSmartInput(val);
    
    if (val.length > 2) {
      const parsed = parseSmartInput(val);
      if (parsed.amount) setAmount(parsed.amount);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.description) setDescription(parsed.description);
    }
  };
`;

c = c.replace(
  "const handleSubmit = (e) => {",
  smartInputHandler + "\n  const handleSubmit = (e) => {"
);

// Clear smart input on submit
c = c.replace(
  "setAmount('');",
  "setAmount('');\n    setSmartInput('');"
);
c = c.replace(
  "setDescription('');",
  "setDescription('');\n    setSmartInput('');"
);

// Add UI for smart input at the top of the form
const smartInputUI = `
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
              Type your expense naturally. We'll fill the form automatically!
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>`;

c = c.replace(
  /<div style=\{\{ display: 'flex', gap: '16px', marginBottom: '20px' \}\}>/,
  smartInputUI
);

fs.writeFileSync('src/components/QuickExpenseModal.jsx', c, 'utf8');
console.log('QuickExpenseModal updated with Smart Input.');
