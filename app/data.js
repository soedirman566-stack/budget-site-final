// Hearth & Ledger — seed data for the Prasetyo household, Yogyakarta, November 2026.
// Every amount is in Indonesian rupiah (IDR). Nothing here is fetched: it is all local.

export const HOUSEHOLD = {
  name: 'Keluarga Prasetyo',
  members: 'Andi & Sari, Kirana (11) & Bimo (8)',
  city: 'Yogyakarta',
  month: 'November 2026',
  today: { day: 26, month: 11, year: 2026 },
  savingsRulePct: 20,
};

export const USD_RATE = 15800; // fixed display rate: Rp 15.800 per US$1

export const CATEGORIES = [
  { id: 'housing',   name: 'Housing',   color: '#b4552a', budget: 3500000 },
  { id: 'groceries', name: 'Groceries', color: '#2f5d3a', budget: 3000000 },
  { id: 'utilities', name: 'Utilities', color: '#4a7fa5', budget: 950000 },
  { id: 'transport', name: 'Transport', color: '#8a6d3b', budget: 1200000 },
  { id: 'kids',      name: 'Kids & school', color: '#7a4a8a', budget: 1500000 },
  { id: 'dining',    name: 'Eating out', color: '#c0392b', budget: 900000 },
  { id: 'health',    name: 'Health',    color: '#3d8a7a', budget: 800000 },
  { id: 'fun',       name: 'Fun & leisure', color: '#d98e2b', budget: 700000 },
];

// Rotating palette for categories the household adds themselves.
export const PALETTE = ['#5b7fa6', '#a65b7a', '#6a8a3d', '#b07a2a', '#4a6d8a', '#8a5a3d'];

export const INCOME = [
  { source: 'Gaji Andi — guru SMA', amount: 9500000 },
  { source: 'Gaji Sari — perawat', amount: 4200000 },
  { source: 'Les privat Sari', amount: 700000 },
  { source: 'Bunga deposito', amount: 400000 },
];

// 22 expenses, summing to exactly Rp 8.742.000.
export const EXPENSES = [
  { id: 1,  date: '2026-11-02', label: 'Sewa rumah November', category: 'housing', amount: 3000000 },
  { id: 2,  date: '2026-11-03', label: 'Belanja mingguan — Pasar Beringharjo', category: 'groceries', amount: 486000 },
  { id: 3,  date: '2026-11-04', label: 'Listrik PLN', category: 'utilities', amount: 312000 },
  { id: 4,  date: '2026-11-05', label: 'Bensin Pertalite', category: 'transport', amount: 150000 },
  { id: 5,  date: '2026-11-06', label: 'SPP sekolah Kirana', category: 'kids', amount: 750000 },
  { id: 6,  date: '2026-11-07', label: 'Makan siang keluarga', category: 'dining', amount: 350000 },
  { id: 7,  date: '2026-11-08', label: 'Internet IndiHome', category: 'utilities', amount: 275000 },
  { id: 8,  date: '2026-11-09', label: 'Belanja bulanan — Superindo', category: 'groceries', amount: 677000 },
  { id: 9,  date: '2026-11-10', label: 'Ojek online', category: 'transport', amount: 96000 },
  { id: 10, date: '2026-11-11', label: 'Les piano Bimo', category: 'kids', amount: 400000 },
  { id: 11, date: '2026-11-12', label: 'Iuran RT/RW', category: 'housing', amount: 150000 },
  { id: 12, date: '2026-11-13', label: 'Obat & vitamin', category: 'health', amount: 128000 },
  { id: 13, date: '2026-11-13', label: 'Nasi gudeg Bu Tjitro', category: 'dining', amount: 96000 },
  { id: 14, date: '2026-11-15', label: 'Servis motor', category: 'transport', amount: 235000 },
  { id: 15, date: '2026-11-16', label: 'Buku & alat tulis', category: 'kids', amount: 175000 },
  { id: 16, date: '2026-11-17', label: 'Langganan streaming', category: 'fun', amount: 149000 },
  { id: 17, date: '2026-11-18', label: 'Periksa gigi Kirana', category: 'health', amount: 210000 },
  { id: 18, date: '2026-11-19', label: 'Belanja sayur & buah', category: 'groceries', amount: 264000 },
  { id: 19, date: '2026-11-20', label: 'Parkir & tol', category: 'transport', amount: 84000 },
  { id: 20, date: '2026-11-20', label: 'Bakso & es teh', category: 'dining', amount: 68000 },
  { id: 21, date: '2026-11-23', label: 'Perbaikan atap bocor', category: 'housing', amount: 450000 },
  { id: 22, date: '2026-11-25', label: 'Tiket bioskop keluarga', category: 'fun', amount: 237000 },
];

// Five stored months, then live November (computed from the ledger).
export const HISTORY = [
  { month: 'Jun', income: 14800000, spent: 9120000 },
  { month: 'Jul', income: 14800000, spent: 8940000 },
  { month: 'Aug', income: 15300000, spent: 9480000 },
  { month: 'Sep', income: 14800000, spent: 8610000 },
  { month: 'Oct', income: 14800000, spent: 9050000 },
];

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', note: 'Six months of essentials, kept in a separate account', target: 30000000, saved: 18500000, monthly: 1500000 },
  { id: 'bali', name: 'Bali trip', note: 'Four nights in Ubud with the kids, school holiday', target: 8000000, saved: 3250000, monthly: 600000 },
  { id: 'laptop', name: 'Laptop for Kirana', note: 'For schoolwork and her coding club', target: 12000000, saved: 9600000, monthly: 800000 },
];

export const BILLS = [
  { id: 'pln', name: 'Listrik PLN', dueDay: 5, amount: 312000, paid: true },
  { id: 'spp', name: 'SPP sekolah Kirana', dueDay: 8, amount: 750000, paid: true },
  { id: 'wifi', name: 'Internet IndiHome', dueDay: 10, amount: 275000, paid: true },
  { id: 'asuransi', name: 'Asuransi kesehatan', dueDay: 25, amount: 640000, paid: false },
  { id: 'pdam', name: 'Air PDAM', dueDay: 28, amount: 186000, paid: false },
  { id: 'sampah', name: 'Iuran sampah', dueDay: 30, amount: 75000, paid: false },
];

// Concrete household tips per category, shown by the what-if simulator.
export const TIPS = {
  dining: [
    'Cook the family dinner at home three nights a week — a home-cooked meal for four costs about Rp 60.000, against Rp 180.000 eating out.',
    'Keep one "warung night" a week instead of three: the same flavours, a third of the bill.',
  ],
  groceries: [
    'Shop at Pasar Beringharjo on weekday mornings, when the fresh stock is out and prices are lowest.',
    'Buy rice, oil and sugar in bulk at the start of the month instead of in small weekly bags.',
  ],
  transport: [
    'Combine errands into one trip — school run, market and bank in a single loop saves two or three rides a week.',
    'A Trans Jogja pass covers most of the kids’ school runs for less than daily ojek fares.',
  ],
  fun: [
    'Swap one cinema night a month for a film night at home — same popcorn, about Rp 200.000 saved.',
    'Borrow films and books from the neighbourhood library before buying anything new.',
  ],
  utilities: [
    'Run the washing machine after 22:00 and switch the water heater off between uses.',
    'A single LED swap in the three most-used rooms trims the PLN bill every month from then on.',
  ],
  kids: [
    'Buy school supplies in one August trip instead of one-off purchases through the term.',
    'Trade outgrown uniforms and books with other parents at school before buying new.',
  ],
  health: [
    'Use the BPJS clinic for check-ups and prescriptions before the private clinic.',
    'Keep a small medicine box stocked so a late-night pharmacy run never becomes an emergency visit.',
  ],
  housing: [
    'Negotiate the annual rent in December — landlords often hold the price for a tenant who always pays on time.',
    'Fix small leaks at once: a Rp 50.000 patch today beats a Rp 450.000 roof repair later.',
  ],
};

export const FALLBACK_TIP = 'Track this category for a full month first — a cut works best once you can see exactly where the money goes.';
