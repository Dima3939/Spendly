const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('import WebProAnalytics')) {
  c = c.replace(
    "import WebOverview from './pages/WebOverview';",
    "import WebOverview from './pages/WebOverview';\nimport WebProAnalytics from './pages/WebProAnalytics';"
  );
}

if (!c.includes('path="/pro"')) {
  c = c.replace(
    '<Route path="/settings" element={<WebSettings {...webContext} />} />',
    '<Route path="/settings" element={<WebSettings {...webContext} />} />\n              <Route path="/pro" element={<WebProAnalytics {...webContext} />} />'
  );
}

fs.writeFileSync('src/App.jsx', c, 'utf8');
