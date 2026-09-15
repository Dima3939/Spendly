const fs = require('fs');
let content = fs.readFileSync('src/i18n.js', 'utf8');

const newEn = `
        searchPlaceholder: 'Search category, note or tag...',
        allTypes: 'All Types',
        typeExpense: 'Expense',
        typeIncome: 'Income',
        thDateTime: 'Date & Time',
        thCategory: 'Category',
        thNoteTags: 'Note / Tags',
        thAmount: 'Amount',
        noTransactions: 'No matching transactions',
        uncategorized: 'Uncategorized',
        monthlyPlan: 'Monthly plan',
        categories: 'Categories',
        summary: 'Summary',
        totalBudget: 'Total Budget',
        totalSpentPlan: 'Total Spent',
        remaining: 'Remaining',
        makeRoom: 'MAKE ROOM FOR WHAT MATTERS',
        goalsTitle: 'Goals',
        targetLabel: 'Target',
        createNewGoal: 'Create a new goal',
        giveSavingsTarget: 'Give your savings a clear target and deadline.',
        newGoalBtn: 'New goal',
        transactionsTitle: 'Transactions',
`;

const newRu = `
        searchPlaceholder: 'Поиск по категории, заметке или тегу...',
        allTypes: 'Все типы',
        typeExpense: 'Расход',
        typeIncome: 'Доход',
        thDateTime: 'Дата и время',
        thCategory: 'Категория',
        thNoteTags: 'Заметка / Теги',
        thAmount: 'Сумма',
        noTransactions: 'Транзакции не найдены',
        uncategorized: 'Без категории',
        monthlyPlan: 'Месячный план',
        categories: 'Категории',
        summary: 'Сводка',
        totalBudget: 'Общий бюджет',
        totalSpentPlan: 'Всего потрачено',
        remaining: 'Осталось',
        makeRoom: 'КОПИТЕ НА ТО, ЧТО ВАЖНО',
        goalsTitle: 'Цели',
        targetLabel: 'Цель',
        createNewGoal: 'Создать новую цель',
        giveSavingsTarget: 'Задайте вашим сбережениям четкую цель и срок.',
        newGoalBtn: 'Новая цель',
        transactionsTitle: 'Транзакции',
`;

content = content.replace(/en:\s*\{\s*translation:\s*\{/, "en: {\n      translation: {" + newEn);
content = content.replace(/ru:\s*\{\s*translation:\s*\{/, "ru: {\n      translation: {" + newRu);
fs.writeFileSync('src/i18n.js', content, 'utf8');
console.log("i18n.js updated again.");
