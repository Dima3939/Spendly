const fs = require('fs');
let content = fs.readFileSync('src/i18n.js', 'utf8');

const newEn = `
        navOverview: 'Overview',
        navTransactions: 'Transactions',
        navMonthlyPlan: 'Monthly Plan',
        navGoals: 'Goals',
        navSettings: 'Settings',
        navSignOut: 'Sign out',
        settingsTitle: 'Settings',
        settingsDesc: 'Manage your account, preferences, and security.',
        syncedWithCloud: 'Synced with cloud',
        localStorageOnly: 'Local storage only',
        editProfile: 'Edit Profile',
        preferencesTitle: 'Preferences',
        baseCurrency: 'Base Currency',
        baseCurrencyDesc: 'Used for all calculations and displays',
        notifications: 'Notifications',
        notificationsDesc: 'Budget alerts and goal milestones',
        overviewTitle: 'Overview',
        planLabel: 'Plan',
`;

const newRu = `
        navOverview: 'Обзор',
        navTransactions: 'Транзакции',
        navMonthlyPlan: 'План на месяц',
        navGoals: 'Цели',
        navSettings: 'Настройки',
        navSignOut: 'Выйти',
        settingsTitle: 'Настройки',
        settingsDesc: 'Управляйте своим аккаунтом, предпочтениями и безопасностью.',
        syncedWithCloud: 'Синхронизировано с облаком',
        localStorageOnly: 'Только локальное хранилище',
        editProfile: 'Изменить профиль',
        preferencesTitle: 'Предпочтения',
        baseCurrency: 'Основная валюта',
        baseCurrencyDesc: 'Используется для расчетов и отображения',
        notifications: 'Уведомления',
        notificationsDesc: 'Оповещения бюджета и целей',
        overviewTitle: 'Обзор',
        planLabel: 'План',
`;

content = content.replace(/en:\s*\{\s*translation:\s*\{/, "en: {\n      translation: {" + newEn);
content = content.replace(/ru:\s*\{\s*translation:\s*\{/, "ru: {\n      translation: {" + newRu);
fs.writeFileSync('src/i18n.js', content, 'utf8');
console.log("i18n.js updated successfully.");
