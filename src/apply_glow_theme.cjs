const fs = require('fs');

let css = fs.readFileSync('index.css', 'utf8');

const replacement = `:root {
  --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  
  /* Glowing Emerald (iPhone 13 Pro Wallpaper Style) */
  --bg-app: #000000;
  --bg-card: #08120c;
  --bg-card-hover: #0c1a12;
  --bg-card-elevated: #112418;
  --bg-input: #040906;
  
  --text-primary: #ffffff;
  --text-secondary: #9cb5a6;
  --text-muted: #647d6e;
  
  --border-subtle: rgba(21, 214, 119, 0.15);
  --border-focus: #15d677;
  
  --accent-primary: #15d677;
  --accent-primary-glow: rgba(21, 214, 119, 0.4);
  --accent-success: #15d677;
  --accent-success-bg: rgba(21, 214, 119, 0.15);
  --accent-danger: #f43f5e;
  --accent-danger-bg: rgba(244, 63, 94, 0.12);
  --accent-warning: #f59e0b;
  --accent-warning-bg: rgba(245, 158, 11, 0.12);
  --accent-purple: #a855f7;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 26px;
  --radius-full: 9999px;

  --shadow-card: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 40px rgba(21, 214, 119, 0.2);
}

[data-theme='light'] {
  --bg-app: #f2f7f4;
  --bg-card: #ffffff;
  --bg-card-hover: #f0fdf4;
  --bg-card-elevated: #ffffff;
  --bg-input: #f4f7f5;
  
  --text-primary: #040a06;
  --text-secondary: #425248;
  --text-muted: #829689;
  
  --border-subtle: rgba(21, 214, 119, 0.2);
  --border-focus: #0f9e57;
  
  --accent-primary: #0f9e57;
  --accent-primary-glow: rgba(15, 158, 87, 0.2);
  --accent-success: #0f9e57;
  --accent-success-bg: rgba(15, 158, 87, 0.1);
  --accent-danger: #e11d48;
  --accent-danger-bg: rgba(225, 29, 72, 0.1);
  --accent-warning: #d97706;
  --accent-warning-bg: rgba(217, 119, 6, 0.1);
  --accent-purple: #9333ea;

  --shadow-card: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
  --shadow-glow: 0 0 25px rgba(15, 158, 87, 0.15);
}`;

const startIndex = css.indexOf(':root {');
const endIndex = css.indexOf('* {');

if (startIndex !== -1 && endIndex !== -1) {
  css = css.substring(0, startIndex) + replacement + '\n\n' + css.substring(endIndex);
  fs.writeFileSync('index.css', css, 'utf8');
  console.log('Applied glowing emerald theme');
} else {
  console.log('Could not find boundaries');
}
