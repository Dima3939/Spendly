const fs = require('fs');

let c = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf8');

c = c.replace(
  "{ to: '/goals', icon: <Target size={20} />, label: t('navGoals') },",
  "{ to: '/goals', icon: <Target size={20} />, label: t('navGoals') },\n      { to: '/subscriptions', icon: <Repeat size={20} />, label: 'Subscriptions' },"
);

if (!c.includes('<Repeat')) {
  c = c.replace(
    "Target, \n  Settings",
    "Target, \n  Settings, \n  Repeat"
  );
}

fs.writeFileSync('src/layouts/Sidebar.jsx', c, 'utf8');
