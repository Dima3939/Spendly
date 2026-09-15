const fs = require('fs');

let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  "<WebPeriodSetup onPeriodCreated={handlePeriodCreated} currency={currency} />",
  "<WebPeriodSetup onPeriodCreated={handlePeriodCreated} currency={currency} setCurrency={setCurrency} />"
);

c = c.replace(
  "<PeriodSetup onPeriodCreated={handlePeriodCreated} />",
  "<PeriodSetup onPeriodCreated={handlePeriodCreated} currency={currency} setCurrency={setCurrency} />"
);

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('App.jsx updated.');
