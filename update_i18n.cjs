const fs = require('fs');

let content = fs.readFileSync('src/i18n.js', 'utf8');

const newEn = `
        takeControl: 'Take control of your finances.',
        takeControlDesc: 'Set your initial budget and a target date. Spendly will calculate your dynamic daily safe-to-spend limit to keep you in the green.',
        envelopeBudgeting: 'Envelope budgeting',
        allocateFunds: 'Allocate funds intelligently',
        dynamicLimits: 'Dynamic daily limits',
        paceAutoAdjusts: 'Your daily pace auto-adjusts',
        endDateFuture: 'End date must be in the future',
        
        safeToSpendToday: 'Safe to spend today',
        overspentBy: 'Overspent by {{amount}}',
        currentBalance: 'Current balance: {{amount}}',
        spentTotal: 'Spent (Total)',
        outOfBudget: 'Out of {{amount}} budget',
        idealDailyLimit: 'Ideal daily limit',
        recommendedPace: 'Recommended pace',
        dailyRhythm: 'Daily spending rhythm',
        comparePace: 'Compare your actual cumulative spend against the ideal pace.',
        factSpent: 'Fact (Spent)',
        idealPace: 'Ideal (Pace)',
        
        dangerZone: 'Danger Zone',
        irreversibleActions: 'Irreversible actions that affect your account data.',
        clearAllData: 'Clear all data & Reset Period',
        deleteAccount: 'Delete account',
        editBudget: 'Edit Budget',
`;

const newRu = `
        takeControl: 'Возьмите финансы под контроль.',
        takeControlDesc: 'Установите начальный бюджет и дату. Spendly рассчитает динамический дневной лимит, чтобы вы всегда оставались в плюсе.',
        envelopeBudgeting: 'Метод конвертов',
        allocateFunds: 'Грамотно распределяйте средства',
        dynamicLimits: 'Динамические лимиты',
        paceAutoAdjusts: 'Ежедневный ритм подстраивается сам',
        endDateFuture: 'Дата окончания должна быть в будущем',
        
        safeToSpendToday: 'Можно тратить сегодня',
        overspentBy: 'Перерасход на {{amount}}',
        currentBalance: 'Текущий остаток: {{amount}}',
        spentTotal: 'Потрачено (Всего)',
        outOfBudget: 'Из бюджета в {{amount}}',
        idealDailyLimit: 'Идеальный дневной лимит',
        recommendedPace: 'Рекомендуемый темп',
        dailyRhythm: 'Ритм расходов',
        comparePace: 'Сравнивайте фактические траты с идеальным темпом.',
        factSpent: 'Факт (Потрачено)',
        idealPace: 'Идеал (Темп)',
        
        dangerZone: 'Опасная зона',
        irreversibleActions: 'Необратимые действия, влияющие на данные аккаунта.',
        clearAllData: 'Сбросить период',
        deleteAccount: 'Удалить аккаунт',
        editBudget: 'Изменить бюджет',
`;

// Insert into EN block
content = content.replace(/en:\s*\{\s*translation:\s*\{/, "en: {\n      translation: {" + newEn);
// Insert into RU block
content = content.replace(/ru:\s*\{\s*translation:\s*\{/, "ru: {\n      translation: {" + newRu);

fs.writeFileSync('src/i18n.js', content, 'utf8');
console.log("i18n.js updated.");
