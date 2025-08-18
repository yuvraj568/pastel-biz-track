import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, KPIMetrics, ChartDataPoint, ExpenseBreakdown } from '@/types/transaction';
import { useMockData } from '@/hooks/useMockData';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  kpiMetrics: KPIMetrics;
  chartData: ChartDataPoint[];
  expenseBreakdown: ExpenseBreakdown[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const mockData = useMockData();
  const [transactions, setTransactions] = useState<Transaction[]>(mockData.transactions);
  const [searchTerm, setSearchTerm] = useState('');

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: (Date.now() + Math.random()).toString(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  // Calculate KPI metrics from current transactions
  const kpiMetrics: KPIMetrics = {
    totalRevenue: transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0),
    totalProfit: 0
  };
  kpiMetrics.totalProfit = kpiMetrics.totalRevenue - kpiMetrics.totalExpenses;

  // Generate chart data from transactions
  const chartData: ChartDataPoint[] = mockData.chartData.map(month => {
    const monthTransactions = transactions.filter(t => {
      const transactionMonth = new Date(t.date.split('/').reverse().join('-')).getMonth();
      const chartMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month.month);
      return transactionMonth === chartMonth;
    });
    
    const revenue = monthTransactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...month,
      revenue: revenue || month.revenue,
      expenses: expenses || month.expenses
    };
  });

  // Generate expense breakdown from transactions
  const expenseCategories: { [key: string]: number } = {};
  transactions
    .filter(t => t.type === 'Expense')
    .forEach(t => {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    });

  const colors = ['#5AB2FF', '#A0DEFF', '#CAF4FF', '#FFF9D0', '#E8F4FD'];
  const expenseBreakdown: ExpenseBreakdown[] = Object.entries(expenseCategories)
    .map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      kpiMetrics,
      chartData,
      expenseBreakdown,
      searchTerm,
      setSearchTerm
    }}>
      {children}
    </TransactionContext.Provider>
  );
};