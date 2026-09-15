const fs = require('fs');

// 1. Create Audio Effects Utility
const audioCode = `export const playSuccessSound = (enabled = true) => {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    
    // Smooth envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    // Pitch drop for a satisfying "pop/coin" sound
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // A6
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch(e) {
    console.log("Audio not supported or disabled");
  }
};

export const triggerHaptic = (enabled = true) => {
  if (!enabled) return;
  if (navigator.vibrate) {
    navigator.vibrate(10); // 10ms light tap
  }
};`;

fs.writeFileSync('src/utils/audioEffects.js', audioCode, 'utf8');

// 2. Create CSV Export Utility
const csvCode = `export const exportTransactionsToCSV = (transactions, currency) => {
  if (!transactions || transactions.length === 0) {
    alert("No transactions to export.");
    return;
  }

  const headers = ['Date', 'Type', 'Category', 'Description', \`Amount (\${currency})\`];
  
  const rows = transactions.map(tx => {
    const date = new Date(tx.created_at).toLocaleDateString();
    const type = Number(tx.amount) > 0 ? 'Income' : 'Expense';
    const amount = Math.abs(Number(tx.amount)).toFixed(2);
    // Escape quotes
    const desc = \`"\${(tx.description || '').replace(/"/g, '""')}"\`;
    const cat = \`"\${(tx.category || '').replace(/"/g, '""')}"\`;
    
    return [date, type, cat, desc, amount].join(',');
  });

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(',') + "\\n" 
    + rows.join("\\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", \`Spendly_Export_\${new Date().toISOString().split('T')[0]}.csv\`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};`;

fs.writeFileSync('src/utils/exportCsv.js', csvCode, 'utf8');
console.log('Created audioEffects.js and exportCsv.js');
