import { Category, Transaction } from './types';

export const DESIGN_CATEGORIES: Category[] = [
  // Pemasukan
  { id: 'inc1', name: 'Pesanan Logo', type: 'INCOME' },
  { id: 'inc2', name: 'Desain Lainnya', type: 'INCOME' },
  { id: 'inc3', name: 'Percetakan', type: 'INCOME' },
  { id: 'inc4', name: 'Pemasukan Lainnya', type: 'INCOME' },
  
  // Pengeluaran
  { id: 'exp1', name: 'Biaya Iklan', type: 'EXPENSE' },
  { id: 'exp2', name: 'Gaji Karyawan', type: 'EXPENSE' },
  { id: 'exp3', name: 'Internet', type: 'EXPENSE' },
  { id: 'exp4', name: 'Rumah Tangga', type: 'EXPENSE' },
  { id: 'exp5', name: 'Konsumsi', type: 'EXPENSE' },
  { id: 'exp6', name: 'Kontrakan', type: 'EXPENSE' },
  { id: 'exp7', name: 'Maintenance', type: 'EXPENSE' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: '2024-05-01',
    amount: 2500000,
    category: 'Pesanan Logo',
    description: 'Logo Project - Coffee Shop',
    type: 'INCOME',
  },
  {
    id: 't2',
    date: '2024-05-02',
    amount: 500000,
    category: 'Biaya Iklan',
    description: 'Instagram Ads Promo Lebaran',
    type: 'EXPENSE',
  },
  {
    id: 't3',
    date: '2024-05-05',
    amount: 1500000,
    category: 'Desain Lainnya',
    description: 'Desain Menu & Banner',
    type: 'INCOME',
  },
  {
    id: 't4',
    date: '2024-05-10',
    amount: 350000,
    category: 'Internet',
    description: 'WiFi Bulanan IndiHome',
    type: 'EXPENSE',
  },
  {
    id: 't5',
    date: '2024-05-15',
    amount: 4500000,
    category: 'Gaji Karyawan',
    description: 'Gaji Desainer Junior',
    type: 'EXPENSE',
  },
  {
    id: 't6',
    date: '2024-05-20',
    amount: 500000,
    category: 'Konsumsi',
    description: 'Snack & Kopi Meeting',
    type: 'EXPENSE',
  },
   {
    id: 't7',
    date: '2024-05-22',
    amount: 3000000,
    category: 'Percetakan',
    description: 'Cetak Brosur Client A',
    type: 'INCOME',
  },
];

export const THEME = {
    bg: 'bg-zinc-950',
    card: 'bg-zinc-900',
    border: 'border-zinc-800',
    textPrimary: 'text-zinc-50',
    textSecondary: 'text-zinc-400',
    accent: 'orange-500',
    accentHover: 'orange-600',
    accentText: 'text-orange-500',
    accentBg: 'bg-orange-500',
};