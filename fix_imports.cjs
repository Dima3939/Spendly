const fs = require('fs');

// 1. Fix WebTransactions.jsx
let tx = fs.readFileSync('src/pages/WebTransactions.jsx', 'utf8');
tx = tx.replace(/import React, \{ useState, useMemo \} from 'react';/, "import React, { useState, useMemo, useEffect } from 'react';");
fs.writeFileSync('src/pages/WebTransactions.jsx', tx, 'utf8');

// 2. Fix WebSettings.jsx
let set = fs.readFileSync('src/pages/WebSettings.jsx', 'utf8');
set = set.replace(/import \{ Palette, Download, Volume2 \} from 'lucide-react';/, "import { Palette, Download, Volume2, Bell } from 'lucide-react';");
fs.writeFileSync('src/pages/WebSettings.jsx', set, 'utf8');

console.log('Fixed imports in WebTransactions and WebSettings');
