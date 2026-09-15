const fs = require('fs');
let c = fs.readFileSync('src/layouts/Sidebar.jsx', 'utf8');

c = c.replace(/import \{([^}]+)\} from 'lucide-react';/, "import {$1, Sparkles} from 'lucide-react';");

const newLink = `
          <NavLink
            to="/pro"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 16px', borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              background: isActive ? 'rgba(21, 214, 119, 0.1)' : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? '600' : '500',
              transition: 'all 0.2s'
            })}
          >
            <Sparkles size={20} />
            {t('proAnalytics', 'Pro Analytics')}
          </NavLink>
        </nav>
`;

c = c.replace('</nav>', newLink);
fs.writeFileSync('src/layouts/Sidebar.jsx', c, 'utf8');
