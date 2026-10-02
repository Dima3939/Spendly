const fs = require('fs');

let content = fs.readFileSync('src/i18n.js', 'utf8');

const additionalTranslations = {
  en: {
    goalsDesc: "Track several goals and see the monthly contribution needed to stay on time.",
    goalLaptop: "New Laptop",
    goalVacation: "Summer Vacation",
    deadlineLabel: "Deadline:",
    savedLabel: "saved",
    addTxBtn: "Add transaction",
    txEmptyDesc: "Change the filters or log a new entry",
    exportCsvBtn: "Export CSV",
    txModalSupra: "NEW TRANSACTION",
    txModalTitle: "Log an entry",
    txScanReceipt: "Scan a receipt",
    txScanDesc: "Take a photo or choose one from your library",
    txTypeLabel: "Type",
    txTypeExpense: "Expense",
    txTypeIncome: "Income",
    txMerchantLabel: "Merchant or source",
    txMerchantPl: "e.g. Starbucks, Salary",
    txAmountLabel: "Amount",
    txDateLabel: "Date",
    txCategoryLabel: "Category",
    txTagsLabel: "Tags",
    txTagsPl: "work, travel",
    txReview: "Mark as needing review",
    txSaveBtn: "Save transaction"
  },
  ru: {
    goalsDesc: "Отслеживайте несколько целей и узнайте, сколько нужно откладывать каждый месяц.",
    goalLaptop: "Новый Ноутбук",
    goalVacation: "Летний Отпуск",
    deadlineLabel: "Дедлайн:",
    savedLabel: "собрано",
    addTxBtn: "Добавить транзакцию",
    txEmptyDesc: "Измените фильтры или добавьте новую запись",
    exportCsvBtn: "Экспорт CSV",
    txModalSupra: "НОВАЯ ТРАНЗАКЦИЯ",
    txModalTitle: "Добавить запись",
    txScanReceipt: "Отсканировать чек",
    txScanDesc: "Сделайте фото или выберите из галереи",
    txTypeLabel: "Тип",
    txTypeExpense: "Расход",
    txTypeIncome: "Доход",
    txMerchantLabel: "Продавец или источник",
    txMerchantPl: "напр. Starbucks, Зарплата",
    txAmountLabel: "Сумма",
    txDateLabel: "Дата",
    txCategoryLabel: "Категория",
    txTagsLabel: "Теги",
    txTagsPl: "работа, путешествие",
    txReview: "Отметить для проверки",
    txSaveBtn: "Сохранить транзакцию"
  }
};

for (const lang of Object.keys(additionalTranslations)) {
  const block = additionalTranslations[lang];
  let injected = "";
  for (const [k, v] of Object.entries(block)) {
    injected += '      ' + k + ': "' + v + '",\n';
  }
  
  const regex = new RegExp("(" + lang + ": \\{[\\s\\S]*?translation: \\{)");
  content = content.replace(regex, "$1\n" + injected);
}

fs.writeFileSync('src/i18n.js', content, 'utf8');
console.log('Injected Phase 2 translations into i18n.js');
