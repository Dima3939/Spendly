const fs = require('fs');

let c = fs.readFileSync('src/pages/WebTransactions.jsx', 'utf8');

c = c.replace(
    "export default function WebTransactions({ expenses = [], currentPeriod, handleAddExpense, handleAddIncome, handleDeleteTx , currency}) {",
    "export default function WebTransactions({ expenses = [], currentPeriod, handleAddExpense, handleAddIncome, handleDeleteTx , currency, isPro, upgradeToPro}) {"
);

fs.writeFileSync('src/pages/WebTransactions.jsx', c, 'utf8');
console.log('Fixed WebTransactions signature');
