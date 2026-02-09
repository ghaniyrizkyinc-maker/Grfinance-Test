import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[]; // Received from parent
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, categories }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      amount: parseFloat(amount),
      category: category || 'Uncategorized',
      description,
      type,
    });
    // Reset
    setAmount('');
    setDescription('');
    setCategory('');
    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Tambah Transaksi</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Type Selector */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => { setType('INCOME'); setCategory(''); }}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                type === 'INCOME' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                  : 'bg-zinc-800 text-zinc-400 border border-transparent hover:bg-zinc-700'
              }`}
            >
              Uang Masuk
            </button>
            <button
              type="button"
              onClick={() => { setType('EXPENSE'); setCategory(''); }}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                type === 'EXPENSE' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                  : 'bg-zinc-800 text-zinc-400 border border-transparent hover:bg-zinc-700'
              }`}
            >
              Uang Keluar
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Tanggal</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Kategori</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
            >
              <option value="" disabled>Pilih Kategori</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Deskripsi</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors h-24 resize-none"
              placeholder="Contoh: Pembayaran Web Design..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-lg transition-colors mt-2"
          >
            Simpan Transaksi
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;