const fs = require('fs');

// Sidebar.jsx
let sidebar = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf8');
sidebar = sidebar.replace("label: 'Overview'", "label: t('navOverview')");
sidebar = sidebar.replace("label: 'Transactions'", "label: t('navTransactions')");
sidebar = sidebar.replace("label: 'Monthly Plan'", "label: t('navMonthlyPlan')");
sidebar = sidebar.replace("label: 'Goals'", "label: t('navGoals')");
sidebar = sidebar.replace("label: 'Settings'", "label: t('navSettings')");
sidebar = sidebar.replace(/>\s*Sign out\s*</, ">{t('navSignOut')}<");

// Make sure `useTranslation` is imported and used in Sidebar.jsx if it isn't already
if (!sidebar.includes('useTranslation')) {
    sidebar = sidebar.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from 'react-i18next';");
    sidebar = sidebar.replace("export default function Sidebar({ user, onLogout }) {", "export default function Sidebar({ user, onLogout }) {\n  const { t } = useTranslation();");
}
fs.writeFileSync('src/layouts/Sidebar.jsx', sidebar, 'utf8');


// WebSettings.jsx
let settings = fs.readFileSync('src/pages/WebSettings.jsx', 'utf8');
settings = settings.replace(/>\s*Settings\s*<\/h2>/, ">{t('settingsTitle')}</h2>");
settings = settings.replace(/>Manage your account, preferences, and security\.</, ">{t('settingsDesc')}<");
settings = settings.replace(/'Synced with cloud' : 'Local storage only'/, "t('syncedWithCloud') : t('localStorageOnly')");
settings = settings.replace(/>\s*Edit Profile\s*</, ">{t('editProfile')}<");
settings = settings.replace(/>Preferences</, ">{t('preferencesTitle')}<");
settings = settings.replace(/>Base Currency</, ">{t('baseCurrency')}<");
settings = settings.replace(/>Used for all calculations and displays</, ">{t('baseCurrencyDesc')}<");
settings = settings.replace(/>Notifications</, ">{t('notifications')}<");
settings = settings.replace(/>Budget alerts and goal milestones</, ">{t('notificationsDesc')}<");
fs.writeFileSync('src/pages/WebSettings.jsx', settings, 'utf8');


// WebOverview.jsx
let overview = fs.readFileSync('src/pages/WebOverview.jsx', 'utf8');
overview = overview.replace(/>\s*Overview\s*<\/h2>/, ">{t('overviewTitle')}</h2>");
overview = overview.replace(/name="Plan"/, 'name={t("planLabel")}');
fs.writeFileSync('src/pages/WebOverview.jsx', overview, 'utf8');

console.log("Replaced text in Sidebar, WebSettings, WebOverview.");
