# Hearth & Ledger — Household Budget Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Made with vanilla JS](https://img.shields.io/badge/Made%20with-vanilla%20JS-orange.svg)](app/app.js)
[![Offline first](https://img.shields.io/badge/Offline-first-green.svg)](app/index.html)

A household budget planner for a demo family of four in Yogyakarta, November 2026 — built for the make.fun bounty **best-household-budget-site-20261126-1457** ("Make the best household budget site").

## What it does

Five pages, each reached from the top navigation, all reading one shared in-memory state — so an edit anywhere moves the figures everywhere:

- **Dashboard** — income, spent, left and saved at a glance; a donut of spending by category; income vs spent for June–November; the tightest budget, upcoming bills, goal progress and three notes computed from the live figures.
- **Budget Plan** — planned vs income, one card per category with a progress bar and an in-place budget edit, plus an add-a-category form.
- **Ledger** — 22 seeded November expenses with an add form, inline edit, delete and a category filter, with running totals.
- **Goals & Bills** — six bills with due-day status ("Due in 2 days", "Overdue by 1 day") and Mark-paid buttons; three savings goals with progress, ETA and +Rp 100.000 / +Rp 500.000 top-ups.
- **What-If** — pick a category, a goal and a cut (0–60%) and see what the cut frees each month and each year, and how many months sooner the goal lands. Default view: eating out, 25% → Rp 128.500 a month, Rp 1.542.000 a year, Bali trip one month sooner.

A header toggle re-displays every figure in USD at a stated fixed rate of Rp 15.800 per US$1.

## How it is built

Fully offline, no libraries, no build step: static files under `app/`, served by any static HTTP server with `app/` at its root. One module per job — `data.js` (seed data), `state.js` (state and totals), `money.js` (formatting and conversion), `charts.js` (SVG donut and bars), `text.js` (escaping and date labels), one module per page, and `app.js` (router and bindings). Charts are hand-drawn inline SVG; the design is warm paper-and-ink (cream ground, terracotta and deep-green inks, Georgia serif headings), responsive down to phone width.

## Run it

```sh
cd app && python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the kit's vendored `buildDossier` from `vendor/makefun-frontend.ts`.
