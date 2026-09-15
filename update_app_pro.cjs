const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('const [isPro, setIsPro]')) {
  c = c.replace(
    'const [loading, setLoading] = useState(true);',
    "const [loading, setLoading] = useState(true);\n  const [isPro, setIsPro] = useState(false);"
  );

  const upgradeFn = `
  const upgradeToPro = async () => {
    try {
      if (user) {
        const updatedUser = await databaseService.updateUserMetadata({ is_pro: true });
        setUser(updatedUser);
      }
      localStorage.setItem('spendly_is_pro', 'true');
      setIsPro(true);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
`;
  c = c.replace('// Load data on start', upgradeFn + '\n  // Load data on start');

  c = c.replace(
    'setLoading(true);',
    "setLoading(true);\n      setIsPro(currentUser?.user_metadata?.is_pro === true || localStorage.getItem('spendly_is_pro') === 'true');"
  );

  c = c.replace(
    'setUser\n    };',
    "setUser,\n      isPro,\n      upgradeToPro\n    };"
  );

  fs.writeFileSync('src/App.jsx', c, 'utf8');
  console.log("App.jsx modified successfully.");
} else {
  console.log("App.jsx already modified.");
}
