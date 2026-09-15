const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

const oldLoader = `<div style={{ fontSize: '2.5rem', animation: 'pulseGlow 1.5s infinite' }}>⚡</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {t('loading')}
          </div>`;

const newLoader = `<style>
            {\`
              @keyframes premiumPulse {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(21, 214, 119, 0.2)); }
                50% { transform: scale(1.03); filter: drop-shadow(0 0 30px rgba(21, 214, 119, 0.6)); }
              }
              @keyframes shimmerText {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
            \`}
          </style>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src="./logo.svg" 
              alt="Spendly" 
              style={{ 
                width: '72px', 
                height: '72px', 
                animation: 'premiumPulse 2s ease-in-out infinite',
                marginBottom: '24px'
              }} 
            />
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: '700',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(21, 214, 119, 0.9) 50%, rgba(255,255,255,0.1) 100%)',
              backgroundSize: '200% auto',
              color: 'transparent',
              WebkitBackgroundClip: 'text',
              animation: 'shimmerText 2.5s linear infinite'
            }}>
              Spendly
            </div>
          </div>`;

c = c.replace(oldLoader, newLoader);

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('Loader updated.');
