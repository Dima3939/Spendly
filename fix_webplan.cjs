const fs = require('fs');
let c = fs.readFileSync('src/pages/WebPlan.jsx', 'utf8');

c = c.replace(/>\s*YOUR SPENDING PLAN\s*</g, ">{t('yourSpendingPlan')}<");
c = c.replace(/>\s*Copy previous month\s*</g, ">{t('copyPreviousMonth')}<");
c = c.replace(/\{formatMoney\(unassigned\)\} \{currency\} unassigned/g, "{t('unassignedLabel', { amount: formatMoney(unassigned) + ' ' + currency })}");
c = c.replace(/\{formatMoney\(spent\)\} spent/g, "{t('spentLabel', { amount: formatMoney(spent) + ' ' + currency })}");

fs.writeFileSync('src/pages/WebPlan.jsx', c, 'utf8');
console.log("WebPlan fixed.");
