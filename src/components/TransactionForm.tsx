import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Loader2 } from 'lucide-react';
import { TransactionType } from '../types';
import { cn } from '../lib/utils';

interface TransactionFormProps {
  type: TransactionType;
  onSubmit: (data: { amount: number; description: string; category: string; type: TransactionType }) => Promise<void>;
}

export default function TransactionForm({ type, onSubmit }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    setLoading(true);
    try {
      await onSubmit({
        amount: parseFloat(amount),
        description,
        category: category || 'General',
        type
      });
      setAmount('');
      setDescription('');
      setCategory('');
    } finally {
      setLoading(false);
    }
  };

  const isIncome = type === 'income';

  return (
    <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "p-2 rounded-xl",
          isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {isIncome ? <PlusCircle className="w-5 h-5" /> : <MinusCircle className="w-5 h-5" />}
        </div>
        <h3 className="font-medium text-gray-900">
          {isIncome ? 'Nueva Ganancia' : 'Nuevo Gasto'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Cantidad
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all outline-none text-gray-900 font-medium"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Descripción
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all outline-none text-gray-700"
            placeholder="Ej: Alquiler, Salario..."
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Categoría
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all outline-none text-gray-700"
            placeholder="Ej: Comida, Ocio..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50",
            isIncome 
              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200" 
              : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200"
          )}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {isIncome ? 'Añadir Ganancia' : 'Añadir Gasto'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
