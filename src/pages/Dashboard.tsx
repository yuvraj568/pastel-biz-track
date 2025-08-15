import { useMockData } from '@/hooks/useMockData';
import { KPICard } from '@/components/KPICard';
import { ProfitChart } from '@/components/ProfitChart';
import { ExpensePie } from '@/components/ExpensePie';
import { TransactionsTable } from '@/components/TransactionsTable';

export const Dashboard = () => {
  const { kpiMetrics, chartData, expenseBreakdown, transactions } = useMockData();

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Total Revenue" 
          value={kpiMetrics.totalRevenue} 
          currency="USD" 
        />
        <KPICard 
          title="Total Expenses" 
          value={kpiMetrics.totalExpenses} 
          currency="USD" 
        />
        <KPICard 
          title="Total Profit" 
          value={kpiMetrics.totalProfit} 
          currency="USD" 
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