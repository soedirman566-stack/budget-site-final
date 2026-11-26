// Hearth & Ledger — Budget plan: one card per category with a progress bar,
// % used, spent/left, an in-place budget edit, plus an add-a-category form.

import { state, totalIncome, plannedTotal, unplannedRemainder, spentByCategory } from './state.js';
import { formatMoney, percent } from './money.js';
import { escapeHtml } from './text.js';

export function renderBudget() {
  const cur = state.currency;
  const byCat = spentByCategory();
  const planned = plannedTotal();
  const income = totalIncome();
  const unplanned = unplannedRemainder();

  const cards = state.categories.map((cat) => {
    const spent = byCat[cat.id] || 0;
    const used = percent(spent, cat.budget);
    const left = cat.budget - spent;
    const over = left < 0;
    return '<article class="panel budget-card">' +
      '<div class="budget-head"><span class="dot" style="background:' + cat.color + '"></span>' +
      '<h3>' + escapeHtml(cat.name) + '</h3>' +
      '<span class="budget-pct' + (over ? ' over' : '') + '">' + used + '%</span></div>' +
      '<div class="progress"><span style="width:' + Math.min(used, 100) + '%;background:' + cat.color + '"></span></div>' +
      '<p class="panel-text">' + formatMoney(spent, cur) + ' spent of ' + formatMoney(cat.budget, cur) +
      ' planned — <strong>' + (over ? formatMoney(-left, cur) + ' over' : formatMoney(left, cur) + ' left') + '</strong>.</p>' +
      '<form class="inline-form" data-budget-form="' + escapeHtml(cat.id) + '">' +
      '<label>Monthly budget <input type="number" name="budget" min="0" step="500" value="' + cat.budget +
      '" required aria-label="Monthly budget for ' + escapeHtml(cat.name) + '"></label>' +
      '<button type="submit" class="btn small">Update budget</button></form>' +
      '</article>';
  }).join('');

  const incomeRows = state.income.map((item) =>
    '<li><span>' + escapeHtml(item.source) + '</span><span>' + formatMoney(item.amount, cur) + '</span></li>').join('');

  return '<section class="page-head"><h2>The budget plan</h2>' +
    '<p>Every rupiah of income gets a job before the month begins. Edit any budget in place — the dashboard, the ledger and the simulator all follow.</p></section>' +

    '<section class="cards" aria-label="Plan summary">' +
    '<article class="card"><p class="card-label">Planned</p><p class="card-value">' + formatMoney(planned, cur) + '</p><p class="card-sub">Across ' + state.categories.length + ' categories</p></article>' +
    '<article class="card"><p class="card-label">Income</p><p class="card-value">' + formatMoney(income, cur) + '</p><p class="card-sub">November, 4 sources</p></article>' +
    '<article class="card"><p class="card-label">Unplanned</p><p class="card-value">' + formatMoney(unplanned, cur) + '</p><p class="card-sub">Left over for savings &amp; goals</p></article>' +
    '</section>' +

    '<section class="grid-two"><article class="panel"><h3>Where the money comes from</h3>' +
    '<ul class="kv-list">' + incomeRows + '</ul>' +
    '<p class="panel-note">The plan covers ' + percent(planned, income) + '% of income; the rest is the household’s buffer and goal money.</p></article>' +
    '<article class="panel"><h3>Add a category</h3>' +
    '<p class="panel-text">A new jar for something the plan forgot — a colour is picked for it in turn, and it appears on the dashboard at once.</p>' +
    '<form id="add-category-form" class="stack-form">' +
    '<label>Category name <input type="text" name="name" maxlength="40" placeholder="e.g. Pet care" required></label>' +
    '<label>Monthly budget <input type="number" name="budget" min="0" step="500" value="200000" required></label>' +
    '<button type="submit" class="btn">Add category</button></form></article></section>' +

    '<section class="budget-grid">' + cards + '</section>';
}
