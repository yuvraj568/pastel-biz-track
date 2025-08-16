import { useState, useEffect } from 'react';
import { Transaction, ExpenseBreakdown } from '@/types/transaction';
import { useCurrency } from '@/contexts/CurrencyContext';

const categoryColors = [
  '#5AB2FF',
  '#A0DEFF', 
  '#CAF4FF',
  '#FFF9D0',
  '#E8F4FD',
  '#FFE4E1',
  '#E6E6FA',
  '#F0FFFF'
];

export const useExpenseBreakdown = (transactions: Transaction[]) => {
  const { selectedCurrency } = useCurrency();
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown[]>([]);

  useEffect(() => {
    const expenses = transactions.filter(t => 
      t.type === 'Expense' && t.currency === selectedCurrency
    );
    
    const categoryTotals = expenses.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const breakdown = Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category,
      value: amount,
      color: categoryColors[index % categoryColors.length]
    }));

    setExpenseBreakdown(breakdown);
  }, [transactions, selectedCurrency]);

  return expenseBreakdown;
};