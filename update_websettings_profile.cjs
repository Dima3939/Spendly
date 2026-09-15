const fs = require('fs');
let c = fs.readFileSync('src/pages/WebSettings.jsx', 'utf8');

c = c.replace(
  "export default function WebSettings({ user, currentPeriod, currency, setCurrency, handleResetPeriod }) {",
  "import { useState } from 'react';\nimport databaseService from '../services/SupabaseService';\n\nexport default function WebSettings({ user, currentPeriod, currency, setCurrency, handleResetPeriod, setUser }) {\n  const [isEditingProfile, setIsEditingProfile] = useState(false);\n  const [newName, setNewName] = useState(user?.user_metadata?.username || user?.email || localStorage.getItem('spendly_guest_name') || 'Guest User');"
);

const displayName = "user?.user_metadata?.username || user?.email || localStorage.getItem('spendly_guest_name') || 'Guest User'";
c = c.replace("{user?.email || 'Guest User'}", "{" + displayName + "}");

const firstLetter = "user?.user_metadata?.username ? user.user_metadata.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : (localStorage.getItem('spendly_guest_name') ? localStorage.getItem('spendly_guest_name').charAt(0).toUpperCase() : 'G'))";
c = c.replace("{user?.email ? user.email.charAt(0).toUpperCase() : 'G'}", "{" + firstLetter + "}");

const handleSaveProfile = `
  const handleSaveProfile = async () => {
    try {
      if (user) {
        // Authenticated user
        const updatedUser = await databaseService.updateUserMetadata({ username: newName });
        setUser(updatedUser);
      } else {
        // Guest user
        localStorage.setItem('spendly_guest_name', newName);
        // Force re-render
        setNewName(newName);
      }
      setIsEditingProfile(false);
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };
`;

c = c.replace("const { t } = useTranslation();", "const { t } = useTranslation();\n" + handleSaveProfile);

const buttonReplace = `
            {isEditingProfile ? (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-focus)',
                    color: 'var(--text-primary)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    width: '250px'
                  }}
                  autoFocus
                />
                <button 
                  onClick={handleSaveProfile}
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {t('add') || 'Save'}
                </button>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  style={{
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditingProfile(true)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
              >
                {t('editProfile')}
              </button>
            )}
`;

c = c.replace(/<button style=\{\{\s*background: 'var\(--bg-input\)',\s*border: '1px solid var\(--border-subtle\)',\s*padding: '8px 16px',[\s\S]*?\{t\('editProfile'\)\}\s*<\/button>/, buttonReplace);

fs.writeFileSync('src/pages/WebSettings.jsx', c, 'utf8');
console.log("WebSettings.jsx updated with Edit Profile inline form.");
