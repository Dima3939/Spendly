const fs = require('fs');

// 1. WebProAnalytics.jsx
let pro = fs.readFileSync('src/pages/WebProAnalytics.jsx', 'utf8');
pro = pro.replace(/>Unlock Pro Analytics<\/h3>/g, ">{t('proUnlockTitle')}</h3>");
pro = pro.replace(/>\s*Get deep insights into your spending habits with interactive charts and historical trends\.\s*<\/p>/g, ">\n              {t('proUnlockDesc')}\n            </p>");
pro = pro.replace(/>\s*Learn More\s*<\/button>/g, ">\n              {t('proLearnMore')}\n            </button>");
fs.writeFileSync('src/pages/WebProAnalytics.jsx', pro, 'utf8');

// 2. WebSubscriptions.jsx
let subs = fs.readFileSync('src/pages/WebSubscriptions.jsx', 'utf8');
subs = subs.replace(/\{isAdding \? 'Cancel' : 'Add New'\}/g, "{isAdding ? t('cancel') : t('subsAdd')}");
fs.writeFileSync('src/pages/WebSubscriptions.jsx', subs, 'utf8');

// 3. WebGoals.jsx
let goals = fs.readFileSync('src/pages/WebGoals.jsx', 'utf8');
goals = goals.replace(/Track several goals and see the monthly contribution needed to stay on time\./g, "{t('goalsDesc')}");
goals = goals.replace(/'New Laptop'/g, "t('goalLaptop')");
goals = goals.replace(/'Summer Vacation'/g, "t('goalVacation')");
goals = goals.replace(/Deadline:/g, "{t('deadlineLabel')}");
goals = goals.replace(/\} saved/g, "} {t('savedLabel')}");
fs.writeFileSync('src/pages/WebGoals.jsx', goals, 'utf8');

// 4. WebTransactions.jsx
let tx = fs.readFileSync('src/pages/WebTransactions.jsx', 'utf8');
tx = tx.replace(/Add transaction/g, "{t('addTxBtn')}");
tx = tx.replace(/Export CSV/g, "{t('exportCsvBtn')}");
tx = tx.replace(/Change the filters or log a new entry/g, "{t('txEmptyDesc')}");
fs.writeFileSync('src/pages/WebTransactions.jsx', tx, 'utf8');

// 5. WebTransactionModal.jsx
let mod = fs.readFileSync('src/components/WebTransactionModal.jsx', 'utf8');
mod = mod.replace(/New Transaction/g, "{t('txModalSupra')}");
mod = mod.replace(/Log an entry/g, "{t('txModalTitle')}");
mod = mod.replace(/Scan a receipt/g, "{t('txScanReceipt')}");
mod = mod.replace(/Take a photo or choose one from your library/g, "{t('txScanDesc')}");
mod = mod.replace(/>Type<\/label>/g, ">{t('txTypeLabel')}</label>");
mod = mod.replace(/>Expense<\/option>/g, ">{t('txTypeExpense')}</option>");
mod = mod.replace(/>Income<\/option>/g, ">{t('txTypeIncome')}</option>");
mod = mod.replace(/>Merchant or source<\/label>/g, ">{t('txMerchantLabel')}</label>");
mod = mod.replace(/placeholder="e\.g\. Starbucks, Salary"/g, "placeholder={t('txMerchantPl')}");
mod = mod.replace(/>Amount \(\{currency\}\)<\/label>/g, ">{t('txAmountLabel')} ({currency})</label>");
mod = mod.replace(/>Date<\/label>/g, ">{t('txDateLabel')}</label>");
mod = mod.replace(/>Category<\/label>/g, ">{t('txCategoryLabel')}</label>");
mod = mod.replace(/>Tags<\/label>/g, ">{t('txTagsLabel')}</label>");
mod = mod.replace(/placeholder="work, travel"/g, "placeholder={t('txTagsPl')}");
mod = mod.replace(/>Mark as needing review<\/label>/g, ">{t('txReview')}</label>");
mod = mod.replace(/>\s*Save transaction\s*<\/button>/g, ">\n            {t('txSaveBtn')}\n          </button>");
fs.writeFileSync('src/components/WebTransactionModal.jsx', mod, 'utf8');

console.log('Applied translations pt2 to components.');
