const fs = require('fs');

let paywall = fs.readFileSync('src/components/ProPaywallModal.jsx', 'utf8');

paywall = paywall.replace(/Unlock advanced analytics and take absolute control of your finances\./g, "{t('proUnlockSub')}");
paywall = paywall.replace(/'Advanced Interactive Charts \(Burn Rate, Distributions\)'/g, "t('proFeat1')");
paywall = paywall.replace(/'Historical Trends & Comparisons'/g, "t('proFeat2')");
paywall = paywall.replace(/'Unlimited Categories & Goals'/g, "t('proFeat3')");
paywall = paywall.replace(/'Priority Support & Cloud Sync'/g, "t('proFeat4')");
paywall = paywall.replace(/'Custom Themes \(Coming Soon\)'/g, "t('proFeat5')");
paywall = paywall.replace(/Upgrade for \$4\.99/g, "{t('proUpgradeBtn')}");
paywall = paywall.replace(/Have a promo code\?/g, "{t('proPromoText')}");
paywall = paywall.replace(/ENTER CODE/g, "{t('proPromoPlaceholder')}");
paywall = paywall.replace(/>Apply<\/button>/g, ">{t('proPromoApply')}</button>");

fs.writeFileSync('src/components/ProPaywallModal.jsx', paywall, 'utf8');
console.log('Applied translations to ProPaywallModal.');
