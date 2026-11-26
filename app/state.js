// Hearth & Ledger — the household's state and every total the pages read.
// One in-memory state object, seeded from data.js. Every page reads the same
// totals, so an edit anywhere moves the figures everywhere.

import { CATEGORIES, EXPENSES, INCOME, HISTORY, GOALS, BILLS, PALETTE, HOUSEHOLD } from './data.js';

export const state = {
  currency: 'IDR', // 'IDR' | 'USD'
  categories: CATEGORIES.map((c) => ({ ...c })),
  expenses: EXPENSES.map((e) => ({ ...e })),
  income: INCOME.map((i) => ({ ...i })),
  history: HISTORY.map((h) => ({ ...h })),
  goals: GOALS.map((g) => ({ ...g })),
  bills: BILLS.map((b) => ({ ...b })),
  nextExpenseId: EXPENSES.length + 1,
  nextCategoryColor: 0,
};

export function totalIncome() {
  return state.income.reduce((sum, item) => sum + item.amount, 0);
}

export function spentByCategory() {
  const totals = {};
  for (const cat of state.categories) totals[cat.id] = 0;
  for (const exp of state.expenses) {
    if (totals[exp.category] === undefined) totals[exp.category] = 0;
    totals[exp.category] += exp.amount;
  }
  return totals;
}

export function totalSpent() {
  return state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

export function moneyLeft() {
  return totalIncome() - totalSpent();
}

export function savedPercent() {
  const income = totalIncome();
  if (!income) return 0;
  return Math.round((moneyLeft() / income) * 100);
}

export function plannedTotal() {
  return state.categories.reduce((sum, cat) => sum + cat.budget, 0);
}

export function unplannedRemainder() {
  return totalIncome() - plannedTotal();
}

export function unpaidBillsTotal() {
  return state.bills.filter((b) => !b.paid).reduce((sum, b) => sum + b.amount, 0);
}

export function categoryById(id) {
  return state.categories.find((c) => c.id === id);
}

export function tightestCategory() {
  const spent = spentByCategory();
  let worst = null;
  for (const cat of state.categories) {
    if (!cat.budget) continue;
    const used = spent[cat.id] / cat.budget;
    if (!worst || used > worst.used) worst = { ...cat, spent: spent[cat.id], used };
  }
  return worst;
}

// Months until a goal is funded at its monthly amount (0 when already funded).
export function goalMonthsLeft(goal, extraMonthly) {
  const remaining = goal.target - goal.saved;
  if (remaining <= 0) return 0;
  const monthly = goal.monthly + (extraMonthly || 0);
  if (monthly <= 0) return null;
  return Math.ceil(remaining / monthly);
}

export function addExpense({ date, label, category, amount }) {
  const exp = { id: state.nextExpenseId, date, label, category, amount };
  state.nextExpenseId += 1;
  state.expenses.push(exp);
  return exp;
}

export function updateExpense(id, { date, label, category, amount }) {
  const exp = state.expenses.find((e) => e.id === id);
  if (!exp) return null;
  exp.date = date;
  exp.label = label;
  exp.category = category;
  exp.amount = amount;
  return exp;
}

export function deleteExpense(id) {
  const index = state.expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;
  state.expenses.splice(index, 1);
  return true;
}

export function setBudget(categoryId, budget) {
  const cat = categoryById(categoryId);
  if (!cat) return false;
  cat.budget = Math.max(0, budget);
  return true;
}

export function addCategory(name, budget) {
  const id = 'custom-' + Date.now().toString(36);
  const color = PALETTE[state.nextCategoryColor % PALETTE.length];
  state.nextCategoryColor += 1;
  const cat = { id, name, color, budget: Math.max(0, budget) };
  state.categories.push(cat);
  return cat;
}

export function payBill(billId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (!bill) return false;
  bill.paid = true;
  return true;
}

export function topUpGoal(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return false;
  goal.saved = Math.min(goal.target, goal.saved + amount);
  return true;
}

export { HOUSEHOLD };
