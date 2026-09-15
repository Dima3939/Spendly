const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('import { playSuccessSound, triggerHaptic }')) {
    c = "import { playSuccessSound, triggerHaptic } from './utils/audioEffects';\n" + c;
}

// Add state for themes and sounds
c = c.replace(
  "const [currency, setCurrency] = useState(() => localStorage.getItem('spendly_currency') || '₴');",
  `const [currency, setCurrency] = useState(() => localStorage.getItem('spendly_currency') || '₴');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('spendly_sound') !== 'false');
  const [accentTheme, setAccentTheme] = useState(() => localStorage.getItem('spendly_theme_color') || 'emerald');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', accentTheme);
  }, [accentTheme]);`
);

// Call sounds in handleAddExpense
c = c.replace(
  "const created = await storageService.createTransaction(payload, user);\n      setExpenses(prev => [created, ...prev]);",
  `const created = await storageService.createTransaction(payload, user);
      setExpenses(prev => [created, ...prev]);
      playSuccessSound(soundEnabled);
      triggerHaptic(soundEnabled);`
);

// Call sounds in handleAddIncome
c = c.replace(
  "const created = await storageService.createTransaction(payload, user);\n        setExpenses(prev => [created, ...prev]);",
  `const created = await storageService.createTransaction(payload, user);
        setExpenses(prev => [created, ...prev]);
        playSuccessSound(soundEnabled);
        triggerHaptic(soundEnabled);`
);

// Pass to webContext
c = c.replace(
  "isPro,\n      upgradeToPro",
  `isPro,
      upgradeToPro,
      soundEnabled,
      setSoundEnabled,
      accentTheme,
      setAccentTheme`
);

// Also pass to Mobile Dashboard / Analytics if they need it, but Settings is where we need it. Wait, WebSettings receives webContext. What about mobile Settings tab? Mobile Settings tab is inside App.jsx or does it use webContext?
// Mobile tabs are in App.jsx. Let's see if there's a mobile Settings component.
fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('App.jsx updated with sounds and themes.');
