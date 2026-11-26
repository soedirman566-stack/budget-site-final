// Hearth & Ledger — router, event bindings and the currency toggle.
// Hash routes: #/ (dashboard), #/budget, #/ledger, #/goals, #/simulator.
// Every page reads the same state, so one re-render refreshes every figure.

import { state, addExpense, updateExpense, deleteExpense, setBudget, addCategory, payBill, topUpGoal } from './state.js';
import { renderDashboard } from './dashboard.js';
import { renderBudget } from './budget.js';
import { renderLedger, editFormHTML } from './ledger.js';
import { renderGoals } from './goals.js';
import { renderSimulator } from './simulator.js';
import { RATE_LABEL } from './money.js';

const view = document.getElementById('view');
const currencyToggle = document.getElementById('currency-toggle');
const ledgerFilter = { value: 'all' };
const simSelection = { category: 'dining', goal: 'bali', cut: 25 };

const ROUTES = {
  '': renderDashboard,
  budget: renderBudget,
  ledger: () => renderLedger(ledgerFilter.value),
  goals: renderGoals,
  simulator: () => renderSimulator(simSelection),
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return ROUTES[hash] ? hash : '';
}

function render() {
  const route = currentRoute();
  view.innerHTML = ROUTES[route]();
  document.querySelectorAll('nav a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#/' + route);
  });
  currencyToggle.textContent = state.currency === 'IDR' ? 'IDR · Rp' : 'USD · $';
  currencyToggle.setAttribute('aria-pressed', state.currency === 'USD' ? 'true' : 'false');
  bindPage(route);
}

function rerender() {
  render();
}

function formValues(form) {
  const data = new FormData(form);
  const out = {};
  for (const [key, value] of data.entries()) out[key] = value;
  return out;
}

function bindPage(route) {
  // Currency toggle (header).
  currencyToggle.onclick = () => {
    state.currency = state.currency === 'IDR' ? 'USD' : 'IDR';
    render();
  };

  if (route === 'budget') {
    document.querySelectorAll('[data-budget-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const budget = parseInt(formValues(form).budget, 10);
        if (Number.isFinite(budget) && budget >= 0) {
          setBudget(form.getAttribute('data-budget-form'), budget);
          rerender();
        }
      });
    });
    const addForm = document.getElementById('add-category-form');
    if (addForm) {
      addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = formValues(addForm);
        const name = String(values.name || '').trim();
        const budget = parseInt(values.budget, 10);
        if (name && Number.isFinite(budget) && budget >= 0) {
          addCategory(name, budget);
          rerender();
        }
      });
    }
  }

  if (route === 'ledger') {
    const filter = document.getElementById('ledger-filter');
    if (filter) {
      filter.addEventListener('change', () => {
        ledgerFilter.value = filter.value;
        render();
      });
    }
    const addForm = document.getElementById('add-expense-form');
    if (addForm) {
      addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = formValues(addForm);
        const amount = parseInt(values.amount, 10);
        if (values.label && values.label.trim() && values.date && Number.isFinite(amount) && amount >= 0) {
          addExpense({ date: values.date, label: values.label.trim(), category: values.category, amount });
          rerender();
        }
      });
    }
    view.querySelectorAll('[data-delete-expense]').forEach((button) => {
      button.addEventListener('click', () => {
        deleteExpense(parseInt(button.getAttribute('data-delete-expense'), 10));
        rerender();
      });
    });
    view.querySelectorAll('[data-edit-expense]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = parseInt(button.getAttribute('data-edit-expense'), 10);
        const row = view.querySelector('[data-expense-id="' + id + '"]');
        const exp = state.expenses.find((e) => e.id === id);
        if (!row || !exp) return;
        const form = document.createElement('form');
        form.className = 'edit-expense-form';
        form.innerHTML = editFormHTML(exp);
        row.innerHTML = '';
        row.appendChild(form);
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const values = formValues(form);
          const amount = parseInt(values.amount, 10);
          if (values.label && values.label.trim() && values.date && Number.isFinite(amount) && amount >= 0) {
            updateExpense(id, { date: values.date, label: values.label.trim(), category: values.category, amount });
            rerender();
          }
        });
        const cancel = form.querySelector('[data-cancel-edit]');
        if (cancel) cancel.addEventListener('click', () => rerender());
      });
    });
  }

  if (route === 'goals') {
    view.querySelectorAll('[data-pay-bill]').forEach((button) => {
      button.addEventListener('click', () => {
        payBill(button.getAttribute('data-pay-bill'));
        rerender();
      });
    });
    view.querySelectorAll('[data-topup-goal]').forEach((button) => {
      button.addEventListener('click', () => {
        topUpGoal(button.getAttribute('data-topup-goal'), parseInt(button.getAttribute('data-topup-amount'), 10));
        rerender();
      });
    });
  }

  if (route === 'simulator') {
    const catSelect = document.getElementById('sim-category');
    const goalSelect = document.getElementById('sim-goal');
    const cut = document.getElementById('sim-cut');
    if (catSelect) catSelect.addEventListener('change', () => { simSelection.category = catSelect.value; render(); });
    if (goalSelect) goalSelect.addEventListener('change', () => { simSelection.goal = goalSelect.value; render(); });
    if (cut) cut.addEventListener('input', () => { simSelection.cut = parseInt(cut.value, 10); render(); });
  }
}

window.addEventListener('hashchange', render);

// Footer note: the rate the toggle uses, stated on the page.
const rateNote = document.getElementById('rate-note');
if (rateNote) rateNote.textContent = 'Currency shown at a fixed rate of ' + RATE_LABEL + '.';

render();
