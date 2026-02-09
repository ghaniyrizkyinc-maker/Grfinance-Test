import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Transaction } from '../types';

interface ChartsProps {
  transactions: Transaction[];
}

const COLORS = ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

export const IncomeExpenseChart: React.FC<ChartsProps> = ({ transactions }) => {
  // Process data for last 6 months or simplify to current data for demo
  const data = transactions.reduce((acc: any[], t) => {
    const month = new Date(t.date).toLocaleString('id-ID', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    
    if (existing) {
      if (t.type === 'INCOME') existing.income += t.amount;
      else existing.expense += t.amount;
    } else {
      acc.push({
        name: month,
        income: t.type === 'INCOME' ? t.amount : 0,
        expense: t.type === 'EXPENSE' ? t.amount : 0,
      });
    }
    return acc;
  }, []);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="name" stroke="#71717a" tick={{ fill: '#71717a' }} />
          <YAxis stroke="#71717a" tick={{ fill: '#71717a' }} tickFormatter={(val) => `Rp${val/1000}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
            formatter={(value: number) => [`Rp ${value.toLocaleString()}`, '']}
          />
          <Legend />
          <Bar dataKey="income" name="Pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ExpenseCategoryChart: React.FC<ChartsProps> = ({ transactions }) => {
  const expenseData = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      {expenseData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                 contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                 formatter={(value: number) => `Rp ${value.toLocaleString()}`}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-zinc-500 text-sm">Belum ada data pengeluaran</p>
      )}
    </div>
  );
};