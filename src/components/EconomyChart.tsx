import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Transaction } from '../types';

interface EconomyChartProps {
  transactions: Transaction[];
}

export default function EconomyChart({ transactions }: EconomyChartProps) {
  // Process transactions to get daily balance
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  let currentBalance = 0;
  const chartData = sortedTransactions.reduce((acc: any[], t) => {
    const date = format(parseISO(t.created_at), 'MMM dd');
    currentBalance += t.type === 'income' ? t.amount : -t.amount;
    
    // If we already have an entry for this date, update it
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.balance = currentBalance;
    } else {
      acc.push({ date, balance: currentBalance });
    }
    return acc;
  }, []);

  // Fill in gaps or limit data points if needed
  const displayData = chartData.slice(-14); // Show last 14 unique days

  return (
    <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm mb-8">
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900">Evolución Económica</h3>
        <p className="text-sm text-gray-400">Balance acumulado en los últimos días</p>
      </div>
      
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#111827" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px'
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#111827" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
