export const exportTransactionsToCSV = (transactions, currency) => {
  if (!transactions || transactions.length === 0) {
    alert("No transactions to export.");
    return;
  }

  const headers = ['Date', 'Type', 'Category', 'Description', `Amount (${currency})`];
  
  const rows = transactions.map(tx => {
    const date = new Date(tx.created_at).toLocaleDateString();
    const type = Number(tx.amount) > 0 ? 'Income' : 'Expense';
    const amount = Math.abs(Number(tx.amount)).toFixed(2);
    // Escape quotes
    const desc = `"${(tx.description || '').replace(/"/g, '""')}"`;
    const cat = `"${(tx.category || '').replace(/"/g, '""')}"`;
    
    return [date, type, cat, desc, amount].join(',');
  });

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(',') + "\n" 
    + rows.join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Spendly_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};