const fs = require('fs');
let content = fs.readFileSync('i18n.js', 'utf8');

content = content.replace(/Let\\\\'s/, "Let\\'s");
content = content.replace(/limitExhausted: 'Daily limit exceeded.*?morrow\\\\'s limit/, "limitExhausted: 'Daily limit exceeded (spent {{spent}} of {{base}}). Tomorrow\\'s limit");
content = content.replace(/greatInPlus: 'Great job, you\\\\'re in the green!/, "greatInPlus: 'Great job, you\\'re in the green!");

fs.writeFileSync('i18n.js', content, 'utf8');
