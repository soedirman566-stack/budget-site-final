// Hearth & Ledger — hand-drawn SVG charts: a spending donut and grouped bars.
// No libraries, no images: pure inline SVG built from the live figures.

import { formatShort } from './money.js';

// Donut of spending by category. Each slice is a stroked circle segment;
// the centre carries the month's total spend.
export function donutSVG(spentByCategory, categories, currency) {
  const total = categories.reduce((sum, cat) => sum + (spentByCategory[cat.id] || 0), 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  let slices = '';
  for (const cat of categories) {
    const value = spentByCategory[cat.id] || 0;
    if (value <= 0) continue;
    const frac = value / total;
    const len = frac * circumference;
    slices += '<circle cx="100" cy="100" r="' + radius + '" fill="none" stroke="' + cat.color +
      '" stroke-width="34" stroke-dasharray="' + Math.max(len - 1.5, 0).toFixed(2) + ' ' +
      (circumference - Math.max(len - 1.5, 0)).toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) +
      '" transform="rotate(-90 100 100)"><title>' + cat.name + ': ' + formatShort(value, currency) + '</title></circle>';
    offset += len;
  }
  return '<svg viewBox="0 0 200 200" class="donut" role="img" aria-label="Spending by category">' +
    '<circle cx="100" cy="100" r="' + radius + '" fill="none" stroke="#efe7d8" stroke-width="34"/>' +
    slices +
    '<text x="100" y="96" text-anchor="middle" class="donut-total">' + formatShort(total, currency) + '</text>' +
    '<text x="100" y="118" text-anchor="middle" class="donut-caption">spent in November</text>' +
    '</svg>';
}

// Grouped bars: income (green) vs spent (terracotta) for each month.
export function barsSVG(months, currency) {
  const max = Math.max.apply(null, months.map((m) => Math.max(m.income, m.spent)));
  const chartW = 560;
  const chartH = 170;
  const groupW = chartW / months.length;
  const barW = 22;
  let bars = '';
  let labels = '';
  months.forEach((m, i) => {
    const x = i * groupW + (groupW - barW * 2 - 8) / 2;
    const incomeH = Math.round((m.income / max) * chartH);
    const spentH = Math.round((m.spent / max) * chartH);
    bars += '<rect x="' + x + '" y="' + (chartH - incomeH) + '" width="' + barW + '" height="' + incomeH +
      '" fill="#2f5d3a" rx="2"><title>' + m.month + ' income: ' + formatShort(m.income, currency) + '</title></rect>';
    bars += '<rect x="' + (x + barW + 8) + '" y="' + (chartH - spentH) + '" width="' + barW + '" height="' + spentH +
      '" fill="#b4552a" rx="2"><title>' + m.month + ' spent: ' + formatShort(m.spent, currency) + '</title></rect>';
    labels += '<text x="' + (i * groupW + groupW / 2) + '" y="' + (chartH + 18) + '" text-anchor="middle" class="bar-label">' + m.month + '</text>';
  });
  return '<svg viewBox="0 0 560 192" class="bars" role="img" aria-label="Income versus spending, June to November">' +
    bars + labels + '</svg>' +
    '<p class="chart-key"><span class="key-swatch key-income"></span> Income &nbsp; <span class="key-swatch key-spent"></span> Spent</p>';
}
