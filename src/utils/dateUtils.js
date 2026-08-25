/**
 * Date and timezone utilities for PostgreSQL / Supabase and local browser time
 */

export const parseTxDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  
  if (typeof dateStr === 'string') {
    // Parse 'YYYY-MM-DD' as local calendar date
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    // If Postgres returned ISO string without explicit Z/offset, treat as UTC
    if (dateStr.includes('T') && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
      return new Date(dateStr + 'Z');
    }

    // Handle space-separated timestamps e.g. "2026-08-25 22:06:00"
    if (dateStr.includes(' ') && !dateStr.includes('+')) {
      return new Date(dateStr.replace(' ', 'T') + 'Z');
    }
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const isSameDay = (d1, d2) => {
  const date1 = parseTxDate(d1);
  const date2 = parseTxDate(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isBeforeDay = (d1, targetDay) => {
  const date1 = parseTxDate(d1);
  const target = parseTxDate(targetDay);
  const d1Midnight = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return d1Midnight < targetMidnight;
};
