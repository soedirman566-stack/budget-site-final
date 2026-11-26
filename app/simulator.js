// Hearth & Ledger — What-if simulator: pick a category, a goal and a cut,
// and see what the cut frees each month and each year, and how many months
// sooner the goal lands. Default view: dining, 25% → Rp 128.500 a month.

import { state, spentByCategory, goalMonthsLeft } from './state.js';
import { formatMoney } from './money.js';
import { escapeHtml } from './text.js';
import { TIPS, FALLBACK_TIP } from './data.js';

export function simulate(categoryId, goalId, cutPct) {
  const byCat = spentByCategory();
  const spent = byCat[categoryId] || 0;
  const freedMonth = Math.round((spent * cutPct) / 100);
  const freedYear = freedMonth * 12;
  const goal = state.goals.find((g) => g.id === goalId) || state.goals[0];
  const baseMonths = goalMonthsLeft(goal, 0);
  const newMonths = goalMonthsLeft(goal, freedMonth);
  const sooner = baseMonths === null || newMonths === null ? 0 : baseMonths - newMonths;
  return { spent, freedMonth, freedYear, goal, baseMonths, newMonths, sooner };
}

export function renderSimulator(selection) {
  const cur = state.currency;
  const sel = selection || { category: 'dining', goal: 'bali', cut: 25 };
  const result = simulate(sel.category, sel.goal, sel.cut);
  const cat = state.categories.find((c) => c.id === sel.category) || state.categories[0];
  const tips = TIPS[sel.category] || [FALLBACK_TIP];

  const catOptions = state.categories.map((c) =>
    '<option value="' + escapeHtml(c.id) + '"' + (c.id === sel.category ? ' selected' : '') + '>' +
    escapeHtml(c.name) + ' — ' + formatMoney((spentByCategory()[c.id] || 0), cur) + '/mo</option>').join('');
  const goalOptions = state.goals.map((g) =>
    '<option value="' + escapeHtml(g.id) + '"' + (g.id === sel.goal ? ' selected' : '') + '>' + escapeHtml(g.name) + '</option>').join('');

  const soonerText = result.sooner > 0
    ? 'The ' + result.goal.name + ' lands <strong>' + result.sooner + ' month' + (result.sooner === 1 ? '' : 's') +
      ' sooner</strong> — in ' + result.newMonths + ' months instead of ' + result.baseMonths + '.'
    : result.baseMonths === 0
      ? 'The ' + result.goal.name + ' is already fully funded.'
      : 'The ' + result.goal.name + ' still lands in ' + result.baseMonths +
        ' months — try a bigger cut, or a category with more spending.';

  return '<section class="page-head"><h2>What if we spent a little less?</h2>' +
    '<p>Small cuts add up fast. Choose a category, a goal to feed the savings to, and how much to trim — the figures below are computed from this month’s real spending.</p></section>' +

    '<section class="panel simulator">' +
    '<div class="sim-controls">' +
    '<label>Cut spending on <select id="sim-category">' + catOptions + '</select></label>' +
    '<label>Feed the savings to <select id="sim-goal">' + goalOptions + '</select></label>' +
    '<label>Trim by <span id="sim-cut-label">' + sel.cut + '%</span>' +
    '<input type="range" id="sim-cut" min="0" max="60" step="5" value="' + sel.cut + '" aria-label="Cut percentage"></label>' +
    '</div>' +
    '<div class="cards sim-results">' +
    '<article class="card"><p class="card-label">Freed each month</p><p class="card-value">' + formatMoney(result.freedMonth, cur) + '</p>' +
    '<p class="card-sub">' + sel.cut + '% of ' + formatMoney(result.spent, cur) + ' on ' + escapeHtml(cat.name) + '</p></article>' +
    '<article class="card"><p class="card-label">Freed each year</p><p class="card-value">' + formatMoney(result.freedYear, cur) + '</p>' +
    '<p class="card-sub">Kept up for 12 months</p></article>' +
    '<article class="card"><p class="card-label">Goal lands sooner</p><p class="card-value">' + (result.sooner > 0 ? result.sooner + ' mo' : '—') + '</p>' +
    '<p class="card-sub">' + escapeHtml(result.goal.name) + '</p></article>' +
    '</div>' +
    '<p class="sim-verdict">' + soonerText + '</p>' +
    '</section>' +

    '<section class="panel"><h3>How to actually save it — ' + escapeHtml(cat.name) + '</h3>' +
    '<ul class="tips-list">' + tips.map((t) => '<li>' + escapeHtml(t) + '</li>').join('') + '</ul>' +
    '<p class="panel-note">A ' + sel.cut + '% trim on ' + escapeHtml(cat.name) + ' is about ' +
    formatMoney(result.freedMonth, cur) + ' a month — roughly ' + formatMoney(Math.round(result.freedMonth / 4), cur) +
    ' a week. Small enough to keep, big enough to feel.</p></section>';
}
