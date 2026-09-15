const fs = require('fs');

let tStr = fs.readFileSync('src/pages/WebTransactions.jsx', 'utf8');
tStr = tStr.replace(/>\s*Transactions\s*</, ">{t('transactionsTitle')}<");
tStr = tStr.replace(/"Search category, note or tag\.\.\."/, "t('searchPlaceholder')");
tStr = tStr.replace(/>All Types</, ">{t('allTypes')}<");
tStr = tStr.replace(/>Date & Time</, ">{t('thDateTime')}<");
tStr = tStr.replace(/>Category</, ">{t('thCategory')}<");
tStr = tStr.replace(/>Note \/ Tags</, ">{t('thNoteTags')}<");
tStr = tStr.replace(/>Amount</, ">{t('thAmount')}<");
tStr = tStr.replace(/'Uncategorized'/, "t('uncategorized')");
tStr = tStr.replace(/>No matching transactions</, ">{t('noTransactions')}<");
fs.writeFileSync('src/pages/WebTransactions.jsx', tStr, 'utf8');

let pStr = fs.readFileSync('src/pages/WebPlan.jsx', 'utf8');
pStr = pStr.replace(/>\s*Monthly plan\s*</, ">{t('monthlyPlan')}<");
pStr = pStr.replace(/>Categories</, ">{t('categories')}<");
pStr = pStr.replace(/>Summary</, ">{t('summary')}<");
pStr = pStr.replace(/>Total Budget</, ">{t('totalBudget')}<");
pStr = pStr.replace(/>Total Spent</, ">{t('totalSpentPlan')}<");
pStr = pStr.replace(/>Remaining</, ">{t('remaining')}<");
fs.writeFileSync('src/pages/WebPlan.jsx', pStr, 'utf8');

let gStr = fs.readFileSync('src/pages/WebGoals.jsx', 'utf8');
gStr = gStr.replace(/>\s*MAKE ROOM FOR WHAT MATTERS\s*</, ">{t('makeRoom')}<");
gStr = gStr.replace(/>\s*Goals\s*</, ">{t('goalsTitle')}<");
gStr = gStr.replace(/>\s*New goal\s*</, ">{t('newGoalBtn')}<");
gStr = gStr.replace(/>\s*Target\s*</g, ">{t('targetLabel')}<");
gStr = gStr.replace(/>Create a new goal</g, ">{t('createNewGoal')}<");
gStr = gStr.replace(/>Give your savings a clear target and deadline\.</g, ">{t('giveSavingsTarget')}<");
fs.writeFileSync('src/pages/WebGoals.jsx', gStr, 'utf8');

console.log("Replaced strings in transactions, plan, and goals.");
