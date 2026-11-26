// Hearth & Ledger — text helpers: HTML escaping and date labels.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// "2026-11-02" -> "2 Nov"
export function dateLabel(isoDate) {
  const parts = isoDate.split('-');
  const day = parseInt(parts[2], 10);
  const month = MONTHS_SHORT[parseInt(parts[1], 10) - 1];
  return day + ' ' + month;
}

// "Due in 2 days", "Due today", "Overdue by 1 day" — today is fixed at 26 Nov 2026.
export function dueLabel(dueDay, todayDay) {
  const diff = dueDay - todayDay;
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff > 1) return 'Due in ' + diff + ' days';
  if (diff === -1) return 'Overdue by 1 day';
  return 'Overdue by ' + (-diff) + ' days';
}
