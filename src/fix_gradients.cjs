const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      replaceInDir(itemPath);
    } else if (itemPath.endsWith('.jsx')) {
      let content = fs.readFileSync(itemPath, 'utf8');
      if (content.includes('#0284c7') || content.includes('#38bdf8')) {
        content = content.replace(/#0284c7/g, 'var(--accent-success)');
        content = content.replace(/#38bdf8/g, 'var(--accent-primary)'); // Fix palette
        fs.writeFileSync(itemPath, content, 'utf8');
        console.log('Fixed colors in ' + itemPath);
      }
    }
  }
}

replaceInDir('.');
