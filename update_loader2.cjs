const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  /<div style=\{\{\s*minHeight: '100vh',[\s\S]*?<\/div>\s*<\/div>/,
  `<div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)'
      }}>
        <style>
          {\`
            @keyframes premiumPulse {
              0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(21, 214, 119, 0.15)); }
              50% { transform: scale(1.04); filter: drop-shadow(0 0 35px rgba(21, 214, 119, 0.7)); }
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
              width: '80px', 
              height: '80px', 
              animation: 'premiumPulse 2.5s ease-in-out infinite',
              marginBottom: '28px'
            }} 
          />
          <div style={{ 
            fontSize: '0.85rem', 
            fontWeight: '800',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(21, 214, 119, 1) 50%, rgba(255,255,255,0.1) 100%)',
            backgroundSize: '200% auto',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            animation: 'shimmerText 2.5s linear infinite'
          }}>
            Spendly
          </div>
        </div>
      </div>`
);

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('Loader updated with regex.');
