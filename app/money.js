// Hearth & Ledger — money formatting and IDR/USD conversion.
// Amounts are stored in IDR; the header toggle re-displays everything in USD
// at the fixed rate Rp 15.800 per US$1, stated on the page.

import { USD_RATE } from './data.js';

export const RATE_LABEL = 'Rp 15.800 per US$1';

function groupThousands(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Full figure: "Rp 14.800.000" or "$936.71".
export function formatMoney(amountIDR, currency) {
  if (currency === 'USD') {
    const usd = amountIDR / USD_RATE;
    return '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return 'Rp ' + groupThousands(amountIDR);
}

// Short figure for charts: "Rp 8,7 jt", "Rp 514 rb", or "$551".
export function formatShort(amountIDR, currency) {
  if (currency === 'USD') {
    const usd = amountIDR / USD_RATE;
    return '$' + Math.round(usd).toLocaleString('en-US');
  }
  if (amountIDR >= 1000000) {
    const jt = amountIDR / 1000000;
    const text = (Math.round(jt * 10) / 10).toString().replace('.', ',');
    return 'Rp ' + text + ' jt';
  }
  if (amountIDR >= 1000) {
    const rb = amountIDR / 1000;
    const text = (Math.round(rb * 10) / 10).toString().replace('.', ',');
    return 'Rp ' + text + ' rb';
  }
  return 'Rp ' + groupThousands(amountIDR);
}

// Whole percent, e.g. 41 for 41%.
export function percent(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}
