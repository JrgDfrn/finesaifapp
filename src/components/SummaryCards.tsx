import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
}

export default function SummaryCards({ totalIncome, totalExpenses }: SummaryCardsProps) {
  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Balance Card */}
      <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Balance Total</span>
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
              <Wallet className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tight text-gray-900">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em]">Ganancias</span>
            <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tight text-emerald-600">
              ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-rose-500/60 uppercase tracking-[0.2em]">Gastos</span>
            <div className="p-2 bg-rose-50 rounded-xl group-hover:bg-rose-100 transition-colors">
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-light tracking-tight text-rose-600">
              ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
