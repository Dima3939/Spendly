const fs = require('fs');

let c = fs.readFileSync('src/components/WebPeriodSetup.jsx', 'utf8');
c = c.replace('"End date must be in the future"', "t('endDateFuture')");
c = c.replace(/Take control of your finances./g, "{t('takeControl')}");
c = c.replace(/Set your initial budget and a target date. Spendly will calculate your dynamic daily safe-to-spend limit to keep you in the green./g, "{t('takeControlDesc')}");
c = c.replace(/Envelope budgeting/g, "{t('envelopeBudgeting')}");
c = c.replace(/Allocate funds intelligently/g, "{t('allocateFunds')}");
c = c.replace(/Dynamic daily limits/g, "{t('dynamicLimits')}");
c = c.replace(/Your daily pace auto-adjusts/g, "{t('paceAutoAdjusts')}");
fs.writeFileSync('src/components/WebPeriodSetup.jsx', c, 'utf8');

let o = fs.readFileSync('src/pages/WebOverview.jsx', 'utf8');
o = o.replace(/Safe to spend today/g, "{t('safeToSpendToday')}");
o = o.replace(/`Overspent by \$\{formatMoney\(overspentAmount\)\} \$\{currency\}`/g, "t('overspentBy', { amount: formatMoney(overspentAmount) + ' ' + currency })");
o = o.replace(/`Current balance: \$\{formatMoney\(currentBalance\)\} \$\{currency\}`/g, "t('currentBalance', { amount: formatMoney(currentBalance) + ' ' + currency })");
o = o.replace(/Spent \(Total\)/g, "{t('spentTotal')}");
o = o.replace(/Out of \{formatMoney\(salary\)\} \{currency\} budget/g, "{t('outOfBudget', { amount: formatMoney(salary) + ' ' + currency })}");
o = o.replace(/Ideal daily limit/g, "{t('idealDailyLimit')}");
o = o.replace(/Recommended pace/g, "{t('recommendedPace')}");
o = o.replace(/Daily spending rhythm/g, "{t('dailyRhythm')}");
o = o.replace(/Compare your actual cumulative spend against the ideal pace./g, "{t('comparePace')}");
o = o.replace(/"Fact \(Spent\)"/g, "{t('factSpent')}");
o = o.replace(/"Ideal \(Pace\)"/g, "{t('idealPace')}");
o = o.replace(/>\s*Edit Budget\s*</g, ">{t('editBudget')}<");
fs.writeFileSync('src/pages/WebOverview.jsx', o, 'utf8');

let s = fs.readFileSync('src/pages/WebSettings.jsx', 'utf8');
s = s.replace(/Danger Zone/g, "{t('dangerZone')}");
s = s.replace(/Irreversible actions that affect your account data./g, "{t('irreversibleActions')}");
s = s.replace(/Clear all data & Reset Period/g, "{t('clearAllData')}");
s = s.replace(/Clear all data/g, "{t('clearAllData')}"); // just in case
s = s.replace(/>\s*Delete account\s*</g, ">{t('deleteAccount')}<");
fs.writeFileSync('src/pages/WebSettings.jsx', s, 'utf8');

console.log("Replaced texts.");
