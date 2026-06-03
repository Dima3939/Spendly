import { useState } from 'react';

export default function ExpenseLog({ expenses, onDelete, onEdit, theme }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const isCli = theme === 'CLI';
  const totalPages = Math.ceil(expenses.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = expenses.slice(indexOfFirstItem, indexOfLastItem);

  const accentColor = isCli ? '#facc15' : '#38bdf8';
  const borderStyle = isCli ? '1px solid #333' : '1px solid #334155';

  return (
    <div style={{ marginTop: '20px', borderTop: isCli ? '1px dashed #444' : '1px dashed #334155', paddingTop: '20px' }}>
      <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px', letterSpacing: '1px' }}>
        {isCli ? '[ИСТОРИЯ ОПЕРАЦИЙ]' : 'История операций'}
      </div>

      {currentItems.length === 0 ? (
        <div style={{ color: '#666', fontSize: '0.85rem', fontStyle: 'italic' }}>
          {isCli ? 'ТРАНЗАКЦИЙ ПОКА НЕТ' : 'Транзакций пока нет'}
        </div>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentItems.map((exp) => {
              const isExpense = Number(exp.amount) < 0;
              const txColor = isExpense ? (isCli ? '#ff5555' : '#f43f5e') : (isCli ? '#00ff66' : '#10b981');
              
              return (
                <li 
                  key={exp.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px', 
                    backgroundColor: isCli ? '#111' : '#1e293b',
                    borderLeft: `2px solid ${txColor}`,
                    fontSize: '0.85rem',
                    borderRadius: isCli ? '0' : '4px'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '10px', overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', color: '#fff' }}>
                      {isCli ? exp.category.toUpperCase() : exp.category}
                    </div>
                    {exp.description && (
                      <div style={{ color: '#666', fontSize: '0.75rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {exp.description}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: txColor, fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {isExpense ? '' : '+'}{exp.amount} ₴
                    </span>
                    
                    {/* Кнопки управления */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={() => onEdit(exp)}
                        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem', padding: '2px 4px' }}
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => onDelete(exp)}
                        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem', padding: '2px 4px' }}
                        title="Удалить"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '15px',
              fontSize: '0.8rem'
            }}>
              <button
                disabled={activePage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                style={{
                  background: 'none',
                  border: isCli ? ('1px solid ' + (activePage === 1 ? '#333' : '#facc15')) : ('1px solid ' + (activePage === 1 ? '#334155' : '#475569')),
                  color: activePage === 1 ? '#444' : accentColor,
                  cursor: activePage === 1 ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  padding: '4px 10px',
                  borderRadius: isCli ? '0' : '4px'
                }}
              >
                {isCli ? '<< НАЗАД' : 'Назад'}
              </button>

              <span style={{ color: '#888' }}>
                {isCli ? `СТРАНИЦА ${activePage} ИЗ ${totalPages}` : `${activePage} / ${totalPages}`}
              </span>

              <button
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                style={{
                  background: 'none',
                  border: isCli ? ('1px solid ' + (activePage === totalPages ? '#333' : '#facc15')) : ('1px solid ' + (activePage === totalPages ? '#334155' : '#475569')),
                  color: activePage === totalPages ? '#444' : accentColor,
                  cursor: activePage === totalPages ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  padding: '4px 10px',
                  borderRadius: isCli ? '0' : '4px'
                }}
              >
                {isCli ? 'ДАЛЕЕ >>' : 'Вперед'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}