const fs = require('fs');
let goals = fs.readFileSync('src/pages/WebGoals.jsx', 'utf8');

// Find the last occurrence of )} and replace it with , document.body)}
const lastIndex = goals.lastIndexOf(')}');
if (lastIndex !== -1) {
  goals = goals.substring(0, lastIndex) + ', document.body)}' + goals.substring(lastIndex + 2);
}

fs.writeFileSync('src/pages/WebGoals.jsx', goals, 'utf8');
console.log('Fixed createPortal in WebGoals.jsx');
