export default function Dashboard({ dailyBudget, currentBalance, salary }) {
  return (
    <section style={{ marginBottom: '30px', background: '#1a1a1a', padding: '15px', borderRadius: '4px' }}>
      <div style={{ fontSize: '0.9rem', color: '#888' }}>ДОСТУПНО НА СЕГОДНЯ111:</div>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#facc15', margin: '5px 0' }}>
        {Number(dailyBudget).toFixed(2)}
      </div>
      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        Общий остаток: {Number(currentBalance).toFixed(2)} / {salary}
      </div>
    </section>
  );
}