// Hearth & Ledger — Ledger: every expense, with add, inline edit, delete,
// a category filter and running totals.

import { state, totalSpent, categoryById } from './state.js';
import { formatMoney } from './money.js';
import { escapeHtml, dateLabel } from './text.js';

export function renderLedger(filter) {
  const cur = state.currency;
  const active = filter || 'all';
  const rows = state.expenses
    .filter((exp) => active === 'all' || exp.category === active)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const shownTotal = rows.reduce((sum, exp) => sum + exp.amount, 0);
  const options = ['<option value="all"' + (active === 'all' ? ' selected' : '') + '>All categories</option>']
    .concat(state.categories.map((c) =>
      '<option value="' + escapeHtml(c.id) + '"' + (active === c.id ? ' selected' : '') + '>' + escapeHtml(c.name) + '</option>'))
    .join('');

  const list = rows.map((exp) => {
    const cat = categoryById(exp.category);
    const dot = cat ? cat.color : '#999';
    const name = cat ? cat.name : exp.category;
    return '<li class="expense" data-expense-id="' + exp.id + '">' +
      '<span class="exp-date">' + dateLabel(exp.date) + '</span>' +
      '<span class="exp-label">' + escapeHtml(exp.label) + '</span>' +
      '<span class="exp-cat"><span class="dot" style="background:' + dot + '"></span>' + escapeHtml(name) + '</span>' +
      '<span class="exp-amount">' + formatMoney(exp.amount, cur) + '</span>' +
      '<span class="exp-actions"><button type="button" class="btn small" data-edit-expense="' + exp.id + '">Edit</button> ' +
      '<button type="button" class="btn small danger" data-delete-expense="' + exp.id + '">Delete</button></span>' +
      '</li>';
  }).join('');

  return '<section class="page-head"><h2>The ledger</h2>' +
    '<p>Every rupiah that left the house this month, newest first. Add, correct or remove an entry and the dashboard totals move with it.</p></section>' +

    '<section class="cards" aria-label="Ledger totals">' +
    '<article class="card"><p class="card-label">Showing</p><p class="card-value">' + rows.length + ' expenses</p><p class="card-sub">' + (active === 'all' ? 'Whole household' : escapeHtml(categoryById(active) ? categoryById(active).name : active)) + '</p></article>' +
    '<article class="card"><p class="card-label">Total shown</p><p class="card-value">' + formatMoney(shownTotal, cur) + '</p><p class="card-sub">Filtered total</p></article>' +
    '<article class="card"><p class="card-label">Month total</p><p class="card-value">' + formatMoney(totalSpent(), cur) + '</p><p class="card-sub">All ' + state.expenses.length + ' expenses</p></article>' +
    '</section>' +

    '<section class="panel"><h3>Add an expense</h3>' +
    '<form id="add-expense-form" class="form-row">' +
    '<label>Date <input type="date" name="date" value="2026-11-26" required></label>' +
    '<label>What was it? <input type="text" name="label" maxlength="60" placeholder="e.g. Belanja sayur" required></label>' +
    '<label>Category <select name="category">' + state.categories.map((c) =>
      '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.name) + '</option>').join('') + '</select></label>' +
    '<label>Amount <input type="number" name="amount" min="0" step="500" placeholder="75000" required></label>' +
    '<button type="submit" class="btn">Add expense</button></form></section>' +

    '<section class="panel"><div class="panel-head"><h3>November expenses</h3>' +
    '<label class="filter-label">Filter <select id="ledger-filter">' + options + '</select></label></div>' +
    '<ul class="expense-list">' + (list || '<li class="empty">No expenses in this category yet.</li>') + '</ul></section>';
}

// The inline edit form that replaces one expense row while it is edited.
export function editFormHTML(exp) {
  return '<span class="exp-edit">' +
    '<label>Date <input type="date" name="date" value="' + escapeHtml(exp.date) + '" required></label>' +
    '<label>What was it? <input type="text" name="label" maxlength="60" value="' + escapeHtml(exp.label) + '" required></label>' +
    '<label>Category <select name="category">' + state.categories.map((c) =>
      '<option value="' + escapeHtml(c.id) + '"' + (c.id === exp.category ? ' selected' : '') + '>' + escapeHtml(c.name) + '</option>').join('') + '</select></label>' +
    '<label>Amount <input type="number" name="amount" min="0" step="500" value="' + exp.amount + '" required></label>' +
    '<button type="submit" class="btn small">Save</button> ' +
    '<button type="button" class="btn small" data-cancel-edit>Cancel</button></span>';
}
