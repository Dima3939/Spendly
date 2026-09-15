const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('isPro,')) {
    c = c.replace(
        '      handleResetPeriod,\n      currency,\n      setCurrency,\n      setUser\n    };',
        '      handleResetPeriod,\n      currency,\n      setCurrency,\n      setUser,\n      isPro,\n      upgradeToPro\n    };'
    );
    // Let's do it with regex to be safe with line endings
    c = c.replace(/setUser\r?\n\s*\};/, 'setUser,\n      isPro,\n      upgradeToPro\n    };');
    fs.writeFileSync('src/App.jsx', c, 'utf8');
    console.log('Fixed webContext');
} else {
    console.log('Already fixed?');
}
