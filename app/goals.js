// Hearth & Ledger — Goals & bills: six bills with due-day status and Mark-paid
// buttons, and three savings goals with progress, ETA and top-up buttons.
// "Today" is fixed at 26 November 2026 so the due wording is stable.

import { state, unpaidBillsTotal, goalMonthsLeft } from './state.js';
import { formatMoney, percent } from './money.js';
import { escapeHtml, dueLabel } from './text.js';
import { HOUSEHOLD } from './data.js';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function etaLabel(goal) {
  const months = goalMonthsLeft(goal, 0);
  if (months === 0) return 'Funded';
  const target = new Date(HOUSEHOLD.today.year, HOUSEHOLD.today.month - 1 + months, 1);
  return 'about ' + months + ' month' + (months === 1 ? '' : 's') + ' left · ' +
    MONTH_NAMES[target.getMonth()] + ' ' + target.getFullYear();
}

export function renderGoals() {
  const cur = state.currency;
  const today = HOUSEHOLD.today.day;

  const billRows = state.bills
    .slice()
    .sort((a, b) => a.dueDay - b.dueDay)
    .map((bill) => {
      const overdue = !bill.paid && bill.dueDay < today;
      return '<li class="bill-row' + (bill.paid ? ' paid' : '') + (overdue ? ' overdue' : '') + '">' +
        '<span class="bill-name">' + escapeHtml(bill.name) + '</span>' +
        '<span class="bill-due">' + (bill.paid ? 'Paid' : dueLabel(bill.dueDay, today)) + '</span>' +
        '<span class="bill-amount">' + formatMoney(bill.amount, cur) + '</span>' +
        (bill.paid
          ? '<span class="bill-done">✓ Paid</span>'
          : '<button type="button" class="btn small" data-pay-bill="' + escapeHtml(bill.id) + '">Mark paid</button>') +
        '</li>';
    }).join('');

  const goalCards = state.goals.map((goal) => {
    const pct = percent(goal.saved, goal.target);
    const funded = goal.saved >= goal.target;
    return '<article class="panel goal-card">' +
      '<h3>' + escapeHtml(goal.name) + '</h3>' +
      '<p class="panel-text">' + escapeHtml(goal.note) + '</p>' +
      '<p class="big-figure">' + formatMoney(goal.saved, cur) + ' <span class="of-target">of ' + formatMoney(goal.target, cur) + '</span></p>' +
      '<div class="progress big"><span style="width:' + pct + '%"></span></div>' +
      '<p class="panel-text"><strong>' + pct + '% there</strong> · saving ' + formatMoney(goal.monthly, cur) +
      ' a month · ' + etaLabel(goal) + '.</p>' +
      (funded
        ? '<p class="funded-note">✓ Fully funded — time to enjoy it.</p>'
        : '<div class="topup-row"><span>Top up:</span>' +
          '<button type="button" class="btn small" data-topup-goal="' + escapeHtml(goal.id) + '" data-topup-amount="100000">+ Rp 100.000</button>' +
          '<button type="button" class="btn small" data-topup-goal="' + escapeHtml(goal.id) + '" data-topup-amount="500000">+ Rp 500.000</button></div>') +
      '</article>';
  }).join('');

  return '<section class="page-head"><h2>Goals &amp; bills</h2>' +
    '<p>What is owed before the month ends, and what the family is saving towards. Today is 26 November 2026.</p></section>' +

    '<section class="cards" aria-label="Bills summary">' +
    '<article class="card"><p class="card-label">Unpaid bills</p><p class="card-value">' + formatMoney(unpaidBillsTotal(), cur) + '</p><p class="card-sub">' + state.bills.filter((b) => !b.paid).length + ' of ' + state.bills.length + ' still open</p></article>' +
    '<article class="card"><p class="card-label">Saved towards goals</p><p class="card-value">' + formatMoney(state.goals.reduce((s, g) => s + g.saved, 0), cur) + '</p><p class="card-sub">Across ' + state.goals.length + ' goals</p></article>' +
    '<article class="card"><p class="card-label">Monthly goal money</p><p class="card-value">' + formatMoney(state.goals.reduce((s, g) => s + g.monthly, 0), cur) + '</p><p class="card-sub">Set aside every month</p></article>' +
    '</section>' +

    '<section class="panel"><h3>Bills due in November</h3>' +
    '<ul class="bill-list full">' + billRows + '</ul>' +
    '<p class="panel-note">Marking a bill paid moves it out of the unpaid total on the dashboard too.</p></section>' +

    '<section class="goal-grid">' + goalCards + '</section>';
}
