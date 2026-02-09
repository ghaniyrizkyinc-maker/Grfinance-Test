import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Plus, 
  Sparkles,
  PieChart as PieChartIcon,
  Search,
  Filter,
  FileText,
  Tags,
  Receipt,
  FilePlus,
  Printer,
  Trash2
} from 'lucide-react';
import StatCard from './components/StatCard';
import { IncomeExpenseChart, ExpenseCategoryChart } from './components/Charts';
import TransactionModal from './components/TransactionModal';
import { MOCK_TRANSACTIONS, DESIGN_CATEGORIES } from './constants';
import { Transaction, DashboardStats, Category, TransactionType, InvoiceItem } from './types';
import { getFinancialAdvice, generateBriefDraft } from './services/geminiService';

const App: React.FC = () => {
  // Global State
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(DESIGN_CATEGORIES);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'reports' | 'categories' | 'invoice' | 'brief'>('dashboard');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // AI State
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Search/Filter State
  const [searchTerm, setSearchTerm] = useState('');

  // Report State
  const [reportMonth, setReportMonth] = useState(new Date().getMonth());
  const [reportYear, setReportYear] = useState(new Date().getFullYear());

  // Category Mgmt State
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<TransactionType>('EXPENSE');

  // Invoice State
  const [invoiceClient, setInvoiceClient] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQty, setNewItemQty] = useState('');

  // Brief State
  const [briefTopic, setBriefTopic] = useState('');
  const [briefResult, setBriefResult] = useState('');
  const [isBriefLoading, setIsBriefLoading] = useState(false);


  // --- Logic for Dashboard ---
  const stats: DashboardStats = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'INCOME') {
          acc.totalIncome += curr.amount;
          acc.totalBalance += curr.amount;
        } else {
          acc.totalExpense += curr.amount;
          acc.totalBalance -= curr.amount;
        }
        return acc;
      },
      { totalBalance: 0, totalIncome: 0, totalExpense: 0 }
    );
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleGetAiAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(transactions.slice(0, 20));
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  // --- Logic for Reports ---
  const reportStats = useMemo(() => {
    const filtered = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === reportMonth && d.getFullYear() === reportYear;
    });

    const income = filtered.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      net: income - expense,
      count: filtered.length
    };
  }, [transactions, reportMonth, reportYear]);

  // --- Logic for Categories ---
  const handleAddCategory = () => {
    if (!newCatName) return;
    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCatName,
      type: newCatType
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  // --- Logic for Invoice ---
  const handleAddInvoiceItem = () => {
    if(!newItemDesc || !newItemPrice) return;
    const item: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: newItemDesc,
      price: parseFloat(newItemPrice),
      quantity: parseFloat(newItemQty) || 1
    };
    setInvoiceItems([...invoiceItems, item]);
    setNewItemDesc('');
    setNewItemPrice('');
    setNewItemQty('');
  };

  const invoiceTotal = invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- Logic for Brief ---
  const handleGenerateBrief = async () => {
    if (!briefTopic) return;
    setIsBriefLoading(true);
    const result = await generateBriefDraft(briefTopic);
    setBriefResult(result);
    setIsBriefLoading(false);
  };


  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans selection:bg-orange-500/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 hidden md:flex flex-col fixed h-full z-10 overflow-y-auto">
        <div className="p-6 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D00000] flex items-center justify-center shrink-0 shadow-lg shadow-red-900/20">
              <span className="text-white font-black italic text-xl tracking-tighter" style={{ fontFamily: 'sans-serif' }}>GR</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Graphichroom</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Filter} label="Transaksi" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
          <SidebarItem icon={FileText} label="Laporan" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <SidebarItem icon={Tags} label="Kategori" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tools</p>
          </div>
          <SidebarItem icon={Receipt} label="Invoice Generator" active={activeTab === 'invoice'} onClick={() => setActiveTab('invoice')} />
          <SidebarItem icon={FilePlus} label="Brief Desain" active={activeTab === 'brief'} onClick={() => setActiveTab('brief')} />
        </nav>

        <div className="p-4 border-t border-zinc-800 shrink-0">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
             <div className="flex items-center gap-2 mb-2 text-orange-500">
                <Sparkles size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
             </div>
             <p className="text-xs text-zinc-400 mb-3">Analisis keuangan cerdas.</p>
             <button 
              onClick={() => { setActiveTab('dashboard'); handleGetAiAdvice(); }}
              disabled={isAiLoading}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-xs font-medium py-2 rounded-lg transition-colors border border-zinc-700"
             >
               {isAiLoading ? 'Menganalisis...' : 'Analisis Sekarang'}
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#D00000] flex items-center justify-center shrink-0 shadow-lg shadow-red-900/20">
              <span className="text-white font-black italic text-sm tracking-tighter">GR</span>
            </div>
             <h1 className="font-bold text-lg text-white">Graphichroom</h1>
           </div>
           <button onClick={() => setIsModalOpen(true)} className="p-2 bg-orange-500 rounded-lg text-black">
             <Plus size={20} />
           </button>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="hidden md:flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                <Plus size={18} /> <span>Transaksi Baru</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="Total Saldo" amount={stats.totalBalance} icon={Wallet} isPositive={stats.totalBalance >= 0} />
              <StatCard title="Pemasukan" amount={stats.totalIncome} icon={ArrowUpCircle} isPositive={true} />
              <StatCard title="Pengeluaran" amount={stats.totalExpense} icon={ArrowDownCircle} isPositive={false} />
            </div>

            {aiAdvice && (
              <div className="bg-zinc-900/50 border border-orange-500/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <h3 className="text-lg font-semibold text-white mb-2 flex gap-2 items-center"><Sparkles size={18} className="text-orange-500"/> Analisis AI</h3>
                <pre className="whitespace-pre-line font-sans text-sm text-zinc-300">{aiAdvice}</pre>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="font-semibold text-zinc-100 mb-6 flex gap-2"><LayoutDashboard size={18} className="text-zinc-400"/> Arus Kas</h3>
                <IncomeExpenseChart transactions={transactions} />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="font-semibold text-zinc-100 mb-6 flex gap-2"><PieChartIcon size={18} className="text-zinc-400"/> Kategori Pengeluaran</h3>
                <ExpenseCategoryChart transactions={transactions} />
              </div>
            </div>
          </div>
        )}

        {/* Transactions View */}
        {activeTab === 'transactions' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-white">Riwayat Transaksi</h2>
               <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                 <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
               </div>
             </div>
             <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-zinc-950 border-b border-zinc-800">
                   <tr>
                     <th className="px-6 py-4 text-xs text-zinc-400 uppercase">Tanggal</th>
                     <th className="px-6 py-4 text-xs text-zinc-400 uppercase">Deskripsi</th>
                     <th className="px-6 py-4 text-xs text-zinc-400 uppercase">Kategori</th>
                     <th className="px-6 py-4 text-xs text-zinc-400 uppercase text-right">Jumlah</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-800">
                   {filteredTransactions.map(t => (
                     <tr key={t.id} className="hover:bg-zinc-800/50">
                       <td className="px-6 py-4 text-sm text-zinc-300">{t.date}</td>
                       <td className="px-6 py-4 text-sm text-white font-medium">{t.description}</td>
                       <td className="px-6 py-4"><span className="badge">{t.category}</span></td>
                       <td className={`px-6 py-4 text-sm font-semibold text-right ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {t.type === 'INCOME' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {/* Reports View */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Laporan Keuangan</h2>
            <div className="flex gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800 w-fit">
              <select value={reportMonth} onChange={(e) => setReportMonth(parseInt(e.target.value))} className="input-field w-40">
                {Array.from({length: 12}, (_, i) => (
                  <option key={i} value={i}>{new Date(0, i).toLocaleString('id-ID', { month: 'long' })}</option>
                ))}
              </select>
              <select value={reportYear} onChange={(e) => setReportYear(parseInt(e.target.value))} className="input-field w-32">
                {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400 text-sm mb-1">Total Pemasukan</p>
                  <p className="text-2xl font-bold text-emerald-500">Rp {reportStats.income.toLocaleString('id-ID')}</p>
               </div>
               <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-400 text-sm mb-1">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-red-500">Rp {reportStats.expense.toLocaleString('id-ID')}</p>
               </div>
               <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
                  <p className="text-zinc-400 text-sm mb-1">Net Profit</p>
                  <p className={`text-2xl font-bold ${reportStats.net >= 0 ? 'text-orange-500' : 'text-red-500'}`}>
                    Rp {reportStats.net.toLocaleString('id-ID')}
                  </p>
               </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
              <p className="text-zinc-400">Menampilkan ringkasan untuk <strong>{reportStats.count} transaksi</strong> pada periode ini.</p>
            </div>
          </div>
        )}

        {/* Categories View */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Manajemen Kategori</h2>
            
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Tambah Kategori Baru</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs text-zinc-400 block mb-1">Nama Kategori</label>
                  <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="input-field" placeholder="Misal: Jasa Desain UI" />
                </div>
                <div className="w-48">
                  <label className="text-xs text-zinc-400 block mb-1">Tipe</label>
                  <select value={newCatType} onChange={(e) => setNewCatType(e.target.value as TransactionType)} className="input-field">
                    <option value="INCOME">Pemasukan</option>
                    <option value="EXPENSE">Pengeluaran</option>
                  </select>
                </div>
                <button onClick={handleAddCategory} className="btn-primary py-2.5">Simpan</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-emerald-500 font-semibold border-b border-zinc-800 pb-2">Kategori Pemasukan</h3>
                {categories.filter(c => c.type === 'INCOME').map(c => (
                  <div key={c.id} className="flex justify-between items-center p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <span>{c.name}</span>
                    <button onClick={() => handleDeleteCategory(c.id)} className="text-zinc-500 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-red-500 font-semibold border-b border-zinc-800 pb-2">Kategori Pengeluaran</h3>
                {categories.filter(c => c.type === 'EXPENSE').map(c => (
                  <div key={c.id} className="flex justify-between items-center p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                    <span>{c.name}</span>
                    <button onClick={() => handleDeleteCategory(c.id)} className="text-zinc-500 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Invoice View */}
        {activeTab === 'invoice' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Invoice Generator</h2>
                <button onClick={() => window.print()} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Printer size={18} /> Print Invoice
                </button>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
                {/* Editor (Hidden on Print) */}
                <div className="space-y-6 print:hidden">
                   <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                      <h3 className="font-semibold border-b border-zinc-800 pb-2">Informasi Client</h3>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Nama Client / Perusahaan</label>
                        <input value={invoiceClient} onChange={e => setInvoiceClient(e.target.value)} className="input-field" placeholder="PT Kreatif Maju Jaya" />
                      </div>
                   </div>

                   <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                      <h3 className="font-semibold border-b border-zinc-800 pb-2">Item Pekerjaan</h3>
                      <div className="grid grid-cols-6 gap-2">
                         <div className="col-span-3">
                           <input value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} placeholder="Deskripsi" className="input-field" />
                         </div>
                         <div className="col-span-1">
                           <input type="number" value={newItemQty} onChange={e => setNewItemQty(e.target.value)} placeholder="Qty" className="input-field" />
                         </div>
                         <div className="col-span-2">
                           <input type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="Harga" className="input-field" />
                         </div>
                      </div>
                      <button onClick={handleAddInvoiceItem} className="w-full btn-secondary py-2 text-sm">Tambah Item</button>
                   </div>
                </div>

                {/* Preview (Printable) */}
                <div className="bg-white text-black p-8 rounded-xl shadow-xl min-h-[500px]">
                   <div className="flex justify-between items-start mb-8">
                      <div>
                         <h1 className="text-3xl font-bold text-orange-600">INVOICE</h1>
                         <p className="text-gray-500 text-sm mt-1">#INV-{Math.floor(Math.random() * 10000)}</p>
                      </div>
                      <div className="text-right">
                         <h4 className="font-bold">Graphichroom Studio</h4>
                         <p className="text-sm text-gray-500">Jakarta, Indonesia</p>
                         <p className="text-sm text-gray-500">support@graphichroom.id</p>
                      </div>
                   </div>

                   <div className="mb-8 border-b pb-4">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Ditagihkan Kepada:</p>
                      <h3 className="text-xl font-bold mt-1">{invoiceClient || 'Nama Client'}</h3>
                      <p className="text-sm text-gray-500 mt-1">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
                   </div>

                   <table className="w-full text-left mb-8">
                      <thead>
                        <tr className="border-b-2 border-orange-500">
                          <th className="py-2 text-sm font-bold uppercase">Deskripsi</th>
                          <th className="py-2 text-sm font-bold uppercase text-center">Qty</th>
                          <th className="py-2 text-sm font-bold uppercase text-right">Harga</th>
                          <th className="py-2 text-sm font-bold uppercase text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceItems.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                             <td className="py-3 text-sm">{item.description}</td>
                             <td className="py-3 text-sm text-center">{item.quantity}</td>
                             <td className="py-3 text-sm text-right">Rp {item.price.toLocaleString('id-ID')}</td>
                             <td className="py-3 text-sm text-right font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                   </table>

                   <div className="flex justify-end">
                      <div className="w-1/2 bg-orange-50 p-4 rounded-lg">
                         <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">Total Tagihan</span>
                            <span className="font-bold text-2xl text-orange-600">Rp {invoiceTotal.toLocaleString('id-ID')}</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="mt-12 text-center text-xs text-gray-400">
                      <p>Terima kasih atas kepercayaan Anda bekerja sama dengan kami.</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Brief View */}
        {activeTab === 'brief' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-white">Design Brief Generator</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <label className="block text-sm font-medium mb-2">Topik / Ide Proyek</label>
                    <textarea 
                      value={briefTopic}
                      onChange={e => setBriefTopic(e.target.value)}
                      className="input-field h-32 resize-none mb-4"
                      placeholder="Contoh: Rebranding untuk Coffee Shop modern dengan target pasar anak muda..."
                    />
                    <button 
                      onClick={handleGenerateBrief} 
                      disabled={isBriefLoading || !briefTopic}
                      className="w-full btn-primary flex justify-center items-center gap-2"
                    >
                      {isBriefLoading ? 'Sedang Berpikir...' : <><Sparkles size={18}/> Buat Kerangka Brief dengan AI</>}
                    </button>
                  </div>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl min-h-[300px]">
                   <h3 className="font-semibold border-b border-zinc-800 pb-4 mb-4">Hasil Brief</h3>
                   {briefResult ? (
                     <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">
                       {briefResult}
                     </pre>
                   ) : (
                     <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
                        <FilePlus size={32} className="mb-2 opacity-50"/>
                        <p>Masukkan topik dan klik tombol untuk generate brief.</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

      </main>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddTransaction} 
        categories={categories}
      />
      
      {/* CSS Utility for Custom Components */}
      <style>{`
        .btn-primary {
          @apply bg-orange-500 hover:bg-orange-600 text-black font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2;
        }
        .btn-secondary {
          @apply bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-4 py-2 rounded-lg transition-colors;
        }
        .input-field {
          @apply w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors;
        }
        .badge {
          @apply px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700;
        }
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:block { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-zinc-900 text-orange-500 border border-zinc-800' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'}`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export default App;