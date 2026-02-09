import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, icon: Icon, isPositive }) => {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-orange-500/50 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg ${isPositive === undefined ? 'bg-zinc-800 text-zinc-400' : isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
           <p className="text-2xl font-bold text-white">{formattedAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;