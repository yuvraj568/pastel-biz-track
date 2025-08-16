import { useState, useEffect } from 'react';
import { Transaction, KPIMetrics } from '@/types/transaction';
import { useCurrency } from '@/contexts/CurrencyContext';

export const useKPIData = (transactions: Transaction[]) => {
  const { selectedCurrency } = useCurrency();
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetrics>({
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0
  });

  useEffect(() => {
    // Filter transactions by selected currency or convert them
    const relevantTransactions = transactions.filter(t => t.currency === selectedCurrency);
    
    const totalRevenue = relevantTransactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = relevantTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalProfit = totalRevenue - totalExpenses;

    setKpiMetrics({
      totalRevenue,
      totalExpenses,
      totalProfit
    });
  }, [transactions, selectedCurrency]);

  return kpiMetrics;
};