const fs = require('fs');

const path = 'src/pages/WebTransactions.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    'export default function WebTransactions({ expenses = [], currentPeriod, handleAddExpense, handleAddIncome, handleDeleteTx , currency}) {',
    'export default function WebTransactions({ expenses = [], currentPeriod, handleAddExpense, handleAddIncome, handleDeleteTx, currency, isPro, upgradeToPro }) {'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed WebTransactions.jsx signature!');
