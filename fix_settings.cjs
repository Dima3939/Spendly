const fs = require('fs');

let c = fs.readFileSync('src/pages/WebSettings.jsx', 'utf8');

c = c.replace(
    "import { User, LogOut, Shield, Bell, Palette } from 'lucide-react';",
    "import { User, LogOut, Shield, Bell, Palette, Download, Volume2, Music } from 'lucide-react';"
);

// I noticed the function signature didn't update!
// export default function WebSettings({ user, currentPeriod, currency, setCurrency, handleResetPeriod, setUser }) {
c = c.replace(
    /export default function WebSettings\(.*?\)\s*\{/,
    "export default function WebSettings({ user, currentPeriod, currency, setCurrency, handleResetPeriod, setUser, isPro, upgradeToPro, soundEnabled, setSoundEnabled, accentTheme, setAccentTheme, expenses }) {"
);

// We need t for translation. Let's see if t is defined inside.
// const { t } = useTranslation();
// Let's add it if missing in props, wait, useTranslation is called inside.

fs.writeFileSync('src/pages/WebSettings.jsx', c, 'utf8');
console.log('Fixed WebSettings imports and signature.');
