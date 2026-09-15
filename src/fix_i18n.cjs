const fs = require('fs');
let content = fs.readFileSync('i18n.js', 'utf8');

// For English/others
content = content.replace(/catShopping: 'Shopping',/g, `catShopping: 'Shopping',
      catEntertainment: 'Entertainment',
      catHealth: 'Health',
      catHome: 'Home',
      catOther: 'Other',
      catTaxes: 'Taxes',`);

// Since previous powershell commands messed up the Russian strings to '???', let's manually overwrite the ru block.
const ruBlockRegex = /ru: \{\s*translation: \{[\s\S]*?\}\s*\}/;

const fixedRuBlock = `ru: {
    translation: {
      appName: 'Spendly',
      welcome: 'Добро пожаловать в Spendly',
      tagline: 'Ваш умный помощник по бюджету',
      loading: 'Загрузка...',
      guest: 'Гость',
      synced: 'Синхронизировано',
      themeLight: 'Светлая тема',
      themeDark: 'Темная тема',
      tabToday: 'Сегодня',
      tabAnalytics: 'Аналитика',
      setupNewPeriod: 'Начать новый период',
      resetConfirm: 'Вы уверены, что хотите сбросить текущий период?',
      addIncome: '+ Доход',
      availableToday: 'Доступно сегодня',
      baseDailyLimit: 'Базовый лимит',
      dynamicDailyLimit: 'Динамический лимит',
      futureDailyLimit: 'Будущий лимит',
      currencyLabel: '₽',
      totalBudget: 'Общий бюджет',
      incomeLabel: 'Доход',
      budgetTopUp: 'Пополнение бюджета',
      catFood: 'Еда',
      catCoffee: 'Кофе',
      catTaxi: 'Такси',
      catShopping: 'Покупки',
      catEntertainment: 'Отдых',
      catHealth: 'Здоровье',
      catHome: 'Быт',
      catOther: 'Другое',
      catTaxes: 'Налоги',
      logout: 'Выйти',
      error: 'Ошибка: {{msg}}',
      historyTitle: 'История транзакций'
    }
  }`;

content = content.replace(ruBlockRegex, fixedRuBlock);

fs.writeFileSync('i18n.js', content, 'utf8');
console.log('Fixed i18n.js');
