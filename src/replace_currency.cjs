const fs = require('fs');
const path = require('path');

function replaceInFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  
  if (content.includes("t('currencyLabel')")) {
    // Replace {t('currencyLabel')} with {currency}
    content = content.replace(/\{t\('currencyLabel'\)\}/g, '{currency}');
    // Replace t('currencyLabel') with currency
    content = content.replace(/t\('currencyLabel'\)/g, 'currency');
    
    // Add currency to props if not already there
    // Match export default function Component({ ... })
    const functionRegex = /export\s+default\s+function\s+\w+\(\s*\{\s*([^}]*)\s*\}\s*\)/;
    const match = content.match(functionRegex);
    
    if (match) {
      const propsStr = match[1];
      if (!propsStr.includes('currency')) {
        const newPropsStr = propsStr ? propsStr + ', currency' : 'currency';
        content = content.replace(functionRegex, (fullMatch, p1) => {
          return fullMatch.replace(p1, newPropsStr);
        });
      }
    }
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Updated ' + filepath);
  }
}

const dirPages = 'pages';
const dirComps = 'components';

fs.readdirSync(dirPages).filter(f => f.endsWith('.jsx')).forEach(f => replaceInFile(path.join(dirPages, f)));
fs.readdirSync(dirComps).filter(f => f.endsWith('.jsx')).forEach(f => replaceInFile(path.join(dirComps, f)));

console.log('Done replacing currency');
