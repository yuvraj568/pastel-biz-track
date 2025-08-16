import { KPICard } from '@/components/KPICard';
import { ProfitChart } from '@/components/ProfitChart';
import { ExpensePie } from '@/components/ExpensePie';
import { TransactionsTable } from '@/components/TransactionsTable';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useKPIData } from '@/hooks/useKPIData';
import { useExpenseBreakdown } from '@/hooks/useExpenseBreakdown';
import { useMockData } from '@/hooks/useMockData';

export const Dashboard = () => {
  const { selectedCurrency } = useCurrency();
  const { transactions, loading } = useTransactions();
  const kpiMetrics = useKPIData(transactions);
  const expenseBreakdown = useExpenseBreakdown(transactions);
  const { chartData } = useMockData(); // Keep chart data as mock for now

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-biztrack-light-blue p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Total Revenue" 
          value={kpiMetrics.totalRevenue} 
          currency={selectedCurrency} 
        />
        <KPICard 
          title="Total Expenses" 
          value={kpiMetrics.totalExpenses} 
          currency={selectedCurrency} 
        />
        <KPICard 
          title="Total Profit" 
          value={kpiMetrics.totalProfit} 
          currency={selectedCurrency} 
          variant="accent"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfitChart data={chartData} />
        <ExpensePie data={expenseBreakdown} />
      </div>

      {/* Recent Transactions */}
      <TransactionsTable transactions={transactions.slice(0, 4)} />
    </div>
  );
};