const fs = require('fs');

let c = fs.readFileSync('src/pages/WebSettings.jsx', 'utf8');

if (!c.includes('exportTransactionsToCSV')) {
    c = "import { exportTransactionsToCSV } from '../utils/exportCsv';\n" + c;
}

if (!c.includes('import { Download, Volume2, Palette as PaletteIcon } from')) {
    c = c.replace(
        "import { Settings, Palette, Bell } from 'lucide-react';",
        "import { Settings, Palette, Bell, Download, Volume2, Music } from 'lucide-react';"
    );
    c = c.replace(
        "import { User, LogOut, Shield, Bell, Palette } from 'lucide-react';",
        "import { User, LogOut, Shield, Bell, Palette, Download, Volume2, Music } from 'lucide-react';"
    );
}

// Replace the entire <div style={{ display: 'flex', flexDirection: 'column' }}> inside Preferences
const newPreferences = `<div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Base Currency */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Palette color="var(--text-muted)" />
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{t('baseCurrency')}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('baseCurrencyDesc')}</div>
                </div>
              </div>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
              >
                <option value="₴">UAH (₴)</option>
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="¥">JPY (¥)</option>
                <option value="₽">RUB (₽)</option>
              </select>
            </div>

            {/* Sound & Haptics */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Volume2 color="var(--text-muted)" />
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Sound & Haptics</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play a soft pop sound when adding transactions</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={soundEnabled} 
                onChange={(e) => {
                  setSoundEnabled(e.target.checked);
                  localStorage.setItem('spendly_sound', e.target.checked);
                }} 
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }} 
              />
            </div>

            {/* Custom Theme (PRO) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Palette color="var(--text-muted)" />
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Accent Theme
                    {!isPro && <span style={{ fontSize: '0.65rem', background: 'var(--accent-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>PRO</span>}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Customize your app color</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', opacity: isPro ? 1 : 0.5, pointerEvents: isPro ? 'auto' : 'none' }}>
                {['emerald', 'cyberblue', 'amethyst', 'gold'].map(t => (
                  <button 
                    key={t}
                    onClick={() => {
                      if (!isPro) return;
                      setAccentTheme(t);
                      localStorage.setItem('spendly_theme_color', t);
                    }}
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer',
                      border: accentTheme === t ? '2px solid #fff' : '2px solid transparent',
                      background: t === 'emerald' ? '#15d677' : t === 'cyberblue' ? '#00e5ff' : t === 'amethyst' ? '#b026ff' : '#ffcc00'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Bell color="var(--text-muted)" />
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{t('notifications')}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('notificationsDesc')}</div>
                </div>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }} />
            </div>

            {/* CSV Export (PRO) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Download color="var(--text-muted)" />
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Export Data (CSV)
                    {!isPro && <span style={{ fontSize: '0.65rem', background: 'var(--accent-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>PRO</span>}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Download all your transactions as a spreadsheet</div>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (isPro) {
                    exportTransactionsToCSV(expenses, currency);
                  } else {
                    upgradeToPro();
                  }
                }}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  color: isPro ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: '600',
                  cursor: isPro ? 'pointer' : 'not-allowed',
                }}
              >
                Download
              </button>
            </div>
          </div>`;

c = c.replace(/<div style=\{\{ display: 'flex', flexDirection: 'column' \}\}>[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* \{t\('dangerZone'\)\} \*\/\}/, newPreferences + "\n        </div>\n\n        {/* {t('dangerZone')} */}");

c = c.replace(
    /export default function WebSettings\(.*?\)\s*\{/,
    "export default function WebSettings({ user, currentPeriod, currency, setCurrency, handleResetPeriod, setUser, isPro, upgradeToPro, soundEnabled, setSoundEnabled, accentTheme, setAccentTheme, expenses, t }) {"
);
// Make sure `t` is defined.
// If it's already destructured from useTranslation inside, we should remove `t` from props or remove it from inside.
// Actually, `const { t } = useTranslation();` is probably already inside WebSettings. Let's just avoid passing it as a prop.
c = c.replace(
    "export default function WebSettings({ user, currentPeriod, currency, setCurrency, handleResetPeriod, setUser, isPro, upgradeToPro, soundEnabled, setSoundEnabled, accentTheme, setAccentTheme, expenses, t }) {",
    "export default function WebSettings({ user, currentPeriod, currency, setCurrency, handleResetPeriod, setUser, isPro, upgradeToPro, soundEnabled, setSoundEnabled, accentTheme, setAccentTheme, expenses }) {"
);

fs.writeFileSync('src/pages/WebSettings.jsx', c, 'utf8');
console.log('Fixed Settings UI.');
