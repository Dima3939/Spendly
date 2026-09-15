const fs = require('fs');

let css = fs.readFileSync('index.css', 'utf8');

const darkReplacements = {
  '--bg-app: #090d16;': '--bg-app: #0b100d;',
  '--bg-card: #131b2e;': '--bg-card: #151e18;',
  '--bg-card-hover: #1a253e;': '--bg-card-hover: #1b261f;',
  '--bg-card-elevated: #1e293b;': '--bg-card-elevated: #212c24;',
  '--bg-input: #0b1120;': '--bg-input: #0e1410;',
  
  '--accent-primary: #38bdf8;': '--accent-primary: #5c7b66;',
  '--accent-primary-glow: rgba(56, 189, 248, 0.25);': '--accent-primary-glow: rgba(92, 123, 102, 0.25);',
  
  '--border-focus: #38bdf8;': '--border-focus: #5c7b66;',
  '--shadow-glow: 0 0 30px rgba(56, 189, 248, 0.15);': '--shadow-glow: 0 0 30px rgba(92, 123, 102, 0.15);'
};

const lightReplacements = {
  '--bg-app: #f1f5f9;': '--bg-app: #f2f5f3;',
  '--bg-card-hover: #f8fafc;': '--bg-card-hover: #f6f8f7;',
  '--bg-input: #f8fafc;': '--bg-input: #f6f8f7;',
  
  '--text-primary: #0f172a;': '--text-primary: #17201a;',
  '--text-secondary: #475569;': '--text-secondary: #4a5c51;',
  '--text-muted: #94a3b8;': '--text-muted: #8d9e92;',
  
  '--border-focus: #0284c7;': '--border-focus: #455e4e;',
  
  '--accent-primary: #0284c7;': '--accent-primary: #455e4e;',
  '--accent-primary-glow: rgba(2, 132, 199, 0.2);': '--accent-primary-glow: rgba(69, 94, 78, 0.2);',
  
  '--shadow-glow: 0 0 25px rgba(2, 132, 199, 0.1);': '--shadow-glow: 0 0 25px rgba(69, 94, 78, 0.1);'
};

for (const [oldVal, newVal] of Object.entries(darkReplacements)) {
  css = css.replace(oldVal, newVal);
}

for (const [oldVal, newVal] of Object.entries(lightReplacements)) {
  css = css.replace(oldVal, newVal);
}

fs.writeFileSync('index.css', css, 'utf8');
console.log('Alpine Green theme applied');
