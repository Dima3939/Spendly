const fs = require('fs');

// 1. Sidebar.jsx
let sidebar = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf8');
sidebar = sidebar.replace(/label:\s*'Subscriptions'/g, "label: t('navSubscriptions')");
sidebar = sidebar.replace(/label:\s*'Pro Analytics'/g, "label: t('navProAnalytics')");
sidebar = sidebar.replace(/>Pro Analytics</g, ">{t('navProAnalytics')}<"); // Just in case it's hardcoded somewhere
fs.writeFileSync('src/layouts/Sidebar.jsx', sidebar, 'utf8');

// 2. WebSubscriptions.jsx
let subs = fs.readFileSync('src/pages/WebSubscriptions.jsx', 'utf8');
subs = subs.replace(/Subscriptions<\/h2>/g, "{t('subsTitle')}</h2>");
subs = subs.replace(/Manage recurring payments \(Netflix, Rent, etc.\)/g, "{t('subsDesc')}");
subs = subs.replace(/>Add New</g, ">{t('subsAdd')}<");
subs = subs.replace(/No subscriptions yet<\/h3>/g, "{t('subsEmptyTitle')}</h3>");
subs = subs.replace(/Add your recurring payments and they will be deducted automatically\.<\/p>/g, "{t('subsEmptyDesc')}</p>");
subs = subs.replace(/>Add Subscription</g, ">{t('subsAddTitle')}<");
subs = subs.replace(/placeholder="Title \(e\.g\. Spotify\)"/g, "placeholder={t('subsInputTitle')}");
subs = subs.replace(/placeholder="Amount"/g, "placeholder={t('subsInputAmount')}");
subs = subs.replace(/>Monthly</g, ">{t('subsMonthly')}<");
subs = subs.replace(/>Yearly</g, ">{t('subsYearly')}<");
subs = subs.replace(/>Save Subscription</g, ">{t('subsSave')}<");
subs = subs.replace(/Next bill:/g, "{t('subsNextBill')}");
fs.writeFileSync('src/pages/WebSubscriptions.jsx', subs, 'utf8');

// 3. WebProAnalytics.jsx
let pro = fs.readFileSync('src/pages/WebProAnalytics.jsx', 'utf8');
pro = pro.replace(/Pro Analytics<\/h2>/g, "{t('proTitle')}</h2>");
pro = pro.replace(/Deep insights and advanced financial charts\./g, "{t('proDesc')}");
pro = pro.replace(/Cumulative Spend \(Burn Rate\)/g, "{t('proChartCumulative')}");
pro = pro.replace(/Income vs Expenses/g, "{t('proChartIncomeExp')}");
fs.writeFileSync('src/pages/WebProAnalytics.jsx', pro, 'utf8');

// 4. ProPaywallModal.jsx
let paywall = fs.readFileSync('src/components/ProPaywallModal.jsx', 'utf8');
paywall = paywall.replace(/Unlock Pro Analytics<\/h3>/g, "{t('proUnlockTitle')}</h3>");
paywall = paywall.replace(/Get deep insights into your spending habits with interactive charts and historical trends\./g, "{t('proUnlockDesc')}");
paywall = paywall.replace(/>Learn More</g, ">{t('proLearnMore')}<");
paywall = paywall.replace(/>Buy PRO /g, ">{t('proBuy')} ");
paywall = paywall.replace(/placeholder="Enter Promo Code"/g, "placeholder={t('proPromoBtn')}");
paywall = paywall.replace(/>Submit</g, ">{t('proSubmit')}<");
fs.writeFileSync('src/components/ProPaywallModal.jsx', paywall, 'utf8');

// 5. WebTransactionModal.jsx
let webMod = fs.readFileSync('src/components/WebTransactionModal.jsx', 'utf8');
webMod = webMod.replace(/> Smart Input/g, "> {t('smartTitle')}");
webMod = webMod.replace(/placeholder="e\.g\. Taxi 15, Coffee 5\.\.\."/g, "placeholder={t('smartPlaceholder')}");
webMod = webMod.replace(/Type your expense naturally\. We'll fill the form below automatically!/g, "{t('smartHelp')}");
fs.writeFileSync('src/components/WebTransactionModal.jsx', webMod, 'utf8');

// 6. QuickExpenseModal.jsx
let qMod = fs.readFileSync('src/components/QuickExpenseModal.jsx', 'utf8');
qMod = qMod.replace(/> Smart Input/g, "> {t('smartTitle')}");
qMod = qMod.replace(/placeholder="e\.g\. Taxi 15, Coffee 5\.\.\."/g, "placeholder={t('smartPlaceholder')}");
qMod = qMod.replace(/Type your expense naturally\. We'll fill the form below automatically!/g, "{t('smartHelp')}");
fs.writeFileSync('src/components/QuickExpenseModal.jsx', qMod, 'utf8');

// 7. WebSettings.jsx
let set = fs.readFileSync('src/pages/WebSettings.jsx', 'utf8');
set = set.replace(/>Sound & Haptics</g, ">{t('soundTitle')}<");
set = set.replace(/>Play a soft pop sound when adding transactions</g, ">{t('soundDesc')}<");
set = set.replace(/>Accent Theme</g, ">{t('themeTitle')}<");
set = set.replace(/>Customize your app color</g, ">{t('themeDesc')}<");
set = set.replace(/>Export Data \(CSV\)</g, ">{t('exportTitle')}<");
set = set.replace(/>Download all your transactions as a spreadsheet</g, ">{t('exportDesc')}<");
set = set.replace(/>Download</g, ">{t('downloadBtn')}<");
fs.writeFileSync('src/pages/WebSettings.jsx', set, 'utf8');

console.log('Applied translations to components.');
