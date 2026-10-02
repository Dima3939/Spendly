const fs = require('fs');
let goals = fs.readFileSync('src/pages/WebGoals.jsx', 'utf8');
goals = goals.split("\\`\\${progress}%\\`").join("progress + '%'");
fs.writeFileSync('src/pages/WebGoals.jsx', goals, 'utf8');
