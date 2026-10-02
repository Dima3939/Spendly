const fs = require('fs');

let content = fs.readFileSync('src/i18n.js', 'utf8');

const paywallTranslations = {
  en: {
    proUnlockSub: "Unlock advanced analytics and take absolute control of your finances.",
    proFeat1: "Advanced Interactive Charts (Burn Rate, Distributions)",
    proFeat2: "Historical Trends & Comparisons",
    proFeat3: "Unlimited Categories & Goals",
    proFeat4: "Priority Support & Cloud Sync",
    proFeat5: "Custom Themes (Coming Soon)",
    proUpgradeBtn: "Upgrade for $4.99",
    proPromoText: "Have a promo code?",
    proPromoApply: "Apply",
    proPromoPlaceholder: "ENTER CODE"
  },
  ru: {
    proUnlockSub: "Откройте продвинутую аналитику и возьмите под контроль свои финансы.",
    proFeat1: "Интерактивные графики (Burn Rate, Распределения)",
    proFeat2: "Исторические тренды и сравнения",
    proFeat3: "Безлимитные категории и цели",
    proFeat4: "Приоритетная поддержка и облачная синхронизация",
    proFeat5: "Пользовательские темы (Скоро)",
    proUpgradeBtn: "Улучшить за $4.99",
    proPromoText: "Есть промокод?",
    proPromoApply: "Применить",
    proPromoPlaceholder: "ВВЕДИТЕ КОД"
  }
};

for (const lang of Object.keys(paywallTranslations)) {
  const block = paywallTranslations[lang];
  let injected = "";
  for (const [k, v] of Object.entries(block)) {
    injected += '      ' + k + ': "' + v + '",\n';
  }
  
  const regex = new RegExp("(" + lang + ": \\{[\\s\\S]*?translation: \\{)");
  content = content.replace(regex, "$1\n" + injected);
}

fs.writeFileSync('src/i18n.js', content, 'utf8');
console.log('Injected Paywall translations into i18n.js');
