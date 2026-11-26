// Hearth & Ledger — Dashboard: the month at a glance.
// Four summary cards, the spending donut, six months of income vs spend,
// the tightest budget, upcoming bills, goal progress and three live notes.

import { state, totalIncome, totalSpent, moneyLeft, savedPercent, spentByCategory, tightestCategory, unpaidBillsTotal, goalMonthsLeft } from './state.js';
import { formatMoney, formatShort, percent } from './money.js';
import { escapeHtml, dueLabel } from './text.js';
import { donutSVG, barsSVG } from './charts.js';
import { HOUSEHOLD } from './data.js';

export function renderDashboard() {
  const cur = state.currency;
  const income = totalIncome();
  const spent = totalSpent();
  const left = moneyLeft();
  const saved = savedPercent();
  const byCat = spentByCategory();
  const tight = tightestCategory();
  const unpaid = unpaidBillsTotal();
  const overdue = state.bills.filter((b) => !b.paid && b.dueDay < HOUSEHOLD.today.day).length;

  const months = state.history.concat([{ month: 'Nov', income, spent }]);

  const upcoming = state.bills
    .filter((b) => !b.paid)
    .sort((a, b) => a.dueDay - b.dueDay)
    .slice(0, 3)
    .map((b) => '<li><span class="bill-name">' + escapeHtml(b.name) + '</span>' +
      '<span class="bill-due">' + dueLabel(b.dueDay, HOUSEHOLD.today.day) + '</span>' +
      '<span class="bill-amount">' + formatMoney(b.amount, cur) + '</span></li>')
    .join('');

  const goalRows = state.goals.map((g) => {
    const pct = percent(g.saved, g.target);
    const monthsLeft = goalMonthsLeft(g, 0);
    return '<li><span class="goal-name">' + escapeHtml(g.name) + '</span>' +
      '<span class="mini-bar"><span style="width:' + pct + '%"></span></span>' +
      '<span class="goal-figure">' + formatShort(g.saved, cur) + ' of ' + formatShort(g.target, cur) +
      (monthsLeft === 0 ? ' · funded' : ' · ' + monthsLeft + ' mo left') + '</span></li>';
  }).join('');

  const legend = state.categories.map((c) => {
    const value = byCat[c.id] || 0;
    return '<li><span class="dot" style="background:' + c.color + '"></span>' + escapeHtml(c.name) +
      '<span class="legend-figure">' + formatShort(value, cur) + ' · ' + percent(value, spent) + '%</span></li>';
  }).join('');

  const tightNote = tight.used > 1
    ? 'Tightest budget: ' + tight.name + ' is ' + formatMoney(tight.spent - tight.budget, cur) +
      ' over its plan (' + percent(tight.spent, tight.budget) + '% used).'
    : 'Tightest budget: ' + tight.name + ' at ' + percent(tight.spent, tight.budget) +
      '% of its plan — ' + formatMoney(tight.budget - tight.spent, cur) + ' still in hand.';
  const billsNote = overdue > 0
    ? 'Bills still open: ' + formatMoney(unpaid, cur) + ' across ' + state.bills.filter((b) => !b.paid).length +
      ' bills, including ' + overdue + ' overdue — pay the health insurance first.'
    : 'Bills still open: ' + formatMoney(unpaid, cur) + ' — nothing overdue, all due within the next few days.';
  const savingsNote = saved >= HOUSEHOLD.savingsRulePct
    ? 'Savings rate ' + saved + '% beats the household’s ' + HOUSEHOLD.savingsRulePct +
      '% rule — ' + formatMoney(left, cur) + ' of this month’s income is still unspent.'
    : 'Savings rate ' + saved + '% is below the household’s ' + HOUSEHOLD.savingsRulePct +
      '% rule — the what-if simulator shows where to find the gap.';

  return '<section class="page-head">' +
    '<h2>November at a glance</h2>' +
    '<p>' + escapeHtml(HOUSEHOLD.members) + ' · ' + escapeHtml(HOUSEHOLD.city) +
    ' · figures update everywhere the moment you change anything.</p></section>' +

    '<section class="cards" aria-label="Summary">' +
    '<article class="card"><p class="card-label">Income</p><p class="card-value">' + formatMoney(income, cur) + '</p><p class="card-sub">4 sources this month</p></article>' +
    '<article class="card"><p class="card-label">Spent</p><p class="card-value">' + formatMoney(spent, cur) + '</p><p class="card-sub">' + state.expenses.length + ' expenses logged</p></article>' +
    '<article class="card"><p class="card-label">Left</p><p class="card-value">' + formatMoney(left, cur) + '</p><p class="card-sub">Unspent income</p></article>' +
    '<article class="card"><p class="card-label">Saved</p><p class="card-value">' + saved + '%</p><p class="card-sub">Household rule: ' + HOUSEHOLD.savingsRulePct + '%</p></article>' +
    '</section>' +

    '<section class="grid-two">' +
    '<article class="panel"><h3>Where the money went</h3>' +
    '<div class="donut-wrap">' + donutSVG(byCat, state.categories, cur) +
    '<ul class="legend">' + legend + '</ul></div></article>' +
    '<article class="panel"><h3>Income vs spent · Jun – Nov</h3>' + barsSVG(months, cur) +
    '<p class="panel-note">November is live: it moves as you add, edit or delete expenses in the ledger.</p></article>' +
    '</section>' +

    '<section class="grid-three">' +
    '<article class="panel"><h3>Tightest budget</h3>' +
    '<p class="big-figure">' + escapeHtml(tight.name) + '</p>' +
    '<p class="panel-text">' + formatMoney(tight.spent, cur) + ' of ' + formatMoney(tight.budget, cur) +
    ' planned — <strong>' + percent(tight.spent, tight.budget) + '% used</strong>.</p>' +
    '<p class="panel-text">Next tightest: ' + nextTightest(byCat) + '.</p>' +
    '<p><a class="btn" href="#/budget">Open the budget plan</a></p></article>' +
    '<article class="panel"><h3>Upcoming bills</h3><ul class="bill-list">' + upcoming + '</ul>' +
    '<p class="panel-text">Unpaid total: <strong>' + formatMoney(unpaid, cur) + '</strong>.</p>' +
    '<p><a class="btn" href="#/goals">Pay bills &amp; goals</a></p></article>' +
    '<article class="panel"><h3>Goals on track</h3><ul class="goal-list">' + goalRows + '</ul>' +
    '<p><a class="btn" href="#/goals">Top up a goal</a></p></article>' +
    '</section>' +

    '<section class="panel notes"><h3>Three things worth knowing</h3><ol class="notes-list">' +
    '<li>' + escapeHtml(tightNote) + '</li>' +
    '<li>' + escapeHtml(billsNote) + '</li>' +
    '<li>' + escapeHtml(savingsNote) + '</li>' +
    '</ol></section>';
}

function nextTightest(byCat) {
  const ranked = state.categories
    .filter((c) => c.budget > 0)
    .map((c) => ({ name: c.name, used: (byCat[c.id] || 0) / c.budget }))
    .sort((a, b) => b.used - a.used);
  if (ranked.length < 2) return '—';
  return ranked[1].name + ' at ' + Math.round(ranked[1].used * 100) + '%';
}
