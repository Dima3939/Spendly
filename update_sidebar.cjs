const fs = require('fs');

let c = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf8');

c = c.replace(
    "Settings, \n  LogOut \n, Sparkles} from 'lucide-react';",
    "Settings, \n  LogOut, \n  Repeat, \n  Sparkles} from 'lucide-react';"
);

const newNav = `  { path: '/plan', icon: CalendarDays, label: t('navPlan') },
    { path: '/subscriptions', icon: Repeat, label: 'Subscriptions' },`;

c = c.replace(
    "{ path: '/plan', icon: CalendarDays, label: t('navPlan') },",
    newNav
);

fs.writeFileSync('src/layouts/Sidebar.jsx', c, 'utf8');
console.log('Sidebar updated with Subscriptions tab.');
