const fs = require('fs');

let c = fs.readFileSync('src/index.css', 'utf8');

const themeCss = `
:root {
  --accent-rgb: 21, 214, 119;
  --accent-success-rgb: 11, 168, 89;
}

[data-theme="cyberblue"] {
  --accent-rgb: 0, 229, 255;
  --accent-success-rgb: 0, 179, 204;
}

[data-theme="amethyst"] {
  --accent-rgb: 176, 38, 255;
  --accent-success-rgb: 138, 30, 204;
}

[data-theme="gold"] {
  --accent-rgb: 255, 204, 0;
  --accent-success-rgb: 204, 153, 0;
}

:root, [data-theme] {
  --accent-primary: rgb(var(--accent-rgb));
  --accent-success: rgb(var(--accent-success-rgb));
  --border-focus: rgb(var(--accent-rgb));
  --shadow-glow: 0 0 15px rgba(var(--accent-rgb), 0.2);
}
`;

// Replace static variables with the dynamic ones
c = c.replace(/--border-focus: #15d677;/g, '--border-focus: var(--accent-primary);');
c = c.replace(/--accent-primary: #15d677;/g, '');
c = c.replace(/--accent-success: #0ba859;/g, '');
c = c.replace(/--shadow-glow: 0 0 15px rgba\(21, 214, 119, 0\.2\);/g, '');

c += themeCss;

fs.writeFileSync('src/index.css', c, 'utf8');
console.log('Updated index.css for themes.');
