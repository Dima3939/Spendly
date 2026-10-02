const fs = require('fs');
let content = fs.readFileSync('src/i18n.js', 'utf8');

const goalsPrompt = {
  en: { goalPromptDesc: "Give your savings a clear target and timeline." },
  ru: { goalPromptDesc: "Задайте вашим сбережениям четкую цель и срок." }
};

for (const lang of Object.keys(goalsPrompt)) {
  const block = goalsPrompt[lang];
  let injected = "";
  for (const [k, v] of Object.entries(block)) {
    injected += '      ' + k + ': "' + v + '",\n';
  }
  const regex = new RegExp("(" + lang + ": \\{[\\s\\S]*?translation: \\{)");
  content = content.replace(regex, "$1\n" + injected);
}
fs.writeFileSync('src/i18n.js', content, 'utf8');

let goals = fs.readFileSync('src/pages/WebGoals.jsx', 'utf8');
goals = goals.replace(/Задайте вашим сбережениям четкую цель и срок\./g, "{t('goalPromptDesc')}");
fs.writeFileSync('src/pages/WebGoals.jsx', goals, 'utf8');
