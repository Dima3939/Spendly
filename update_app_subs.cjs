const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

if (!c.includes('import WebSubscriptions from')) {
    c = c.replace(
        "import WebSettings from './pages/WebSettings';",
        "import WebSettings from './pages/WebSettings';\nimport WebSubscriptions from './pages/WebSubscriptions';"
    );
}

// Add route
if (!c.includes('<Route path="/subscriptions"')) {
    c = c.replace(
        `<Route path="/settings" element={<WebSettings {...webContext} />} />`,
        `<Route path="/settings" element={<WebSettings {...webContext} />} />\n              <Route path="/subscriptions" element={<WebSubscriptions {...webContext} />} />`
    );
}

// Add auto-charge logic in loadData
const processSubsCode = `
      // Process subscriptions
      try {
        const subs = await storageService.getSubscriptions(currentUser);
        const todayD = new Date();
        const todayStr = todayD.toISOString().split('T')[0];
        
        for (const sub of subs) {
          if (sub.next_billing_date <= todayStr) {
            // Charge it if there is an active period that covers today
            const activeNow = periods.find(p => p.start_date <= todayStr && p.end_date >= todayStr);
            if (activeNow) {
              const payload = {
                amount: -Math.abs(Number(sub.amount)),
                category: sub.category || 'Subscriptions',
                description: sub.title + ' (Auto-charged)',
                period_id: activeNow.id,
                created_at: todayD.toISOString()
              };
              await storageService.createTransaction(payload, currentUser);
              
              // Increment next_billing_date
              const nextD = new Date(sub.next_billing_date);
              if (sub.billing_cycle === 'yearly') {
                nextD.setFullYear(nextD.getFullYear() + 1);
              } else {
                nextD.setMonth(nextD.getMonth() + 1);
              }
              await storageService.updateSubscription(sub.id, { next_billing_date: nextD.toISOString().split('T')[0] }, currentUser);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to process subscriptions:', err);
      }
`;

if (!c.includes('// Process subscriptions')) {
    c = c.replace(
        "// Find active period for today",
        processSubsCode + "\n\n        // Find active period for today"
    );
}

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('App.jsx updated with Subscriptions route and auto-charge logic.');
