import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction, TransactionType } from '../types';
import SummaryCards from './SummaryCards';
import EconomyChart from './EconomyChart';
import TransactionForm from './TransactionForm';
import { LogOut, User, LayoutDashboard, History, Settings, Plus } from 'lucide-react';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchTransactions(user.id);
    };
    getUser();
  }, []);

  const fetchTransactions = async (userId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  const handleAddTransaction = async (data: { amount: number; description: string; category: string; type: TransactionType }) => {
    if (!user) return;

    const { data: newTransaction, error } = await supabase
      .from('transactions')
      .insert([{
        ...data,
        user_id: user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      alert('Error al añadir la transacción. Asegúrate de que la tabla "transactions" existe en Supabase.');
    } else {
      setTransactions([...transactions, newTransaction]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-black/5 flex-col p-8 fixed h-full">
        <div className="mb-12">
          <h1 className="text-2xl font-light tracking-tight text-gray-900">FinanzaDash</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-2xl font-medium transition-all">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl font-medium transition-all">
            <History className="w-5 h-5" /> Historial
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl font-medium transition-all">
            <Settings className="w-5 h-5" /> Ajustes
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
              <p className="text-xs text-gray-400">Usuario Pro</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl font-medium transition-all"
          >
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-light tracking-tight text-gray-900">Resumen Financiero</h2>
            <p className="text-gray-400 text-sm mt-1">Controla tu economía personal de un vistazo.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-black/5 rounded-2xl text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
              <Plus className="w-4 h-4" /> Exportar Datos
            </button>
          </div>
        </header>

        {/* Summary Banners */}
        <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} />

        {/* Large Chart */}
        <EconomyChart transactions={transactions} />

        {/* Forms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TransactionForm type="income" onSubmit={handleAddTransaction} />
          <TransactionForm type="expense" onSubmit={handleAddTransaction} />
        </div>

        {/* Recent Transactions List (Mini) */}
        <div className="mt-12 bg-white rounded-[32px] border border-black/5 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            <button className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Ver todo</button>
          </div>
          
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No hay transacciones todavía.</p>
            ) : (
              transactions.slice(-5).reverse().map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.type === 'income' ? <Plus className="w-5 h-5" /> : <Plus className="w-5 h-5 rotate-45" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t.description}</p>
                      <p className="text-xs text-gray-400">{t.category} • {new Date(t.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
