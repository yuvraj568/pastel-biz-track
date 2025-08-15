import { Transaction, KPIMetrics, ChartDataPoint, ExpenseBreakdown, ParsedBill } from '@/types/transaction';

export const useMockData = () => {
  const transactions: Transaction[] = [
    {
      id: '1042',
      date: '04/12/2024',
      type: 'Income',
      account: 'Checking',
      category: 'Sales',
      amount: 300,
      currency: 'USD'
    },
    {
      id: '1041',
      date: '03/12/2024',
      type: 'Expense',
      account: 'Credit Card',
      category: 'Utilities',
      amount: 200,
      currency: 'INR'
    },
    {
      id: '1040',
      date: '02/12/2024',
      type: 'Income',
      account: 'Savings',
      category: 'Travel',
      amount: 1000,
      currency: 'USD'
    },
    {
      id: '1039',
      date: '08/12/2024',
      type: 'Transfer',
      account: 'Wallet',
      category: 'Entertainment',
      amount: 200,
      currency: 'USD'
    },
    {
      id: '1038',
      date: '05/12/2024',
      type: 'Income',
      account: 'Checking',
      category: 'Sales',
      amount: 200,
      currency: 'GBP'
    },
    {
      id: '1037',
      date: '15/12/2024',
      type: 'Income',
      account: 'Wallet',
      category: 'Travel',
      amount: 250,
      currency: 'USD'
    },
    {
      id: '1036',
      date: '03/12/2024',
      type: 'Transfer',
      account: 'Savings',
      category: 'Entertainment',
      amount: 1500,
      currency: 'USD'
    }
  ];

  const kpiMetrics: KPIMetrics = {
    totalRevenue: 12350,
    totalExpenses: 4560,
    totalProfit: 7790
  };

  const chartData: ChartDataPoint[] = [
    { month: 'Jan', revenue: 4000, expenses: 2400 },
    { month: 'Feb', revenue: 3000, expenses: 1398 },
    { month: 'Mar', revenue: 5000, expenses: 3800 },
    { month: 'Apr', revenue: 4780, expenses: 3908 },
    { month: 'May', revenue: 5890, expenses: 4800 },
    { month: 'Jun', revenue: 6390, expenses: 3800 },
    { month: 'Jul', revenue: 6490, expenses: 4300 },
    { month: 'Aug', revenue: 7000, expenses: 4200 },
    { month: 'Sep', revenue: 6800, expenses: 4100 },
    { month: 'Oct', revenue: 7200, expenses: 4400 },
    { month: 'Nov', revenue: 7500, expenses: 4600 },
    { month: 'Dec', revenue: 8000, expenses: 4800 }
  ];

  const expenseBreakdown: ExpenseBreakdown[] = [
    { name: 'Payroll', value: 2500, color: '#5AB2FF' },
    { name: 'Rent', value: 1500, color: '#A0DEFF' },
    { name: 'Utilities', value: 300, color: '#CAF4FF' },
    { name: 'Marketing', value: 200, color: '#FFF9D0' },
    { name: 'Supplies', value: 60, color: '#E8F4FD' }
  ];

  const parsedBills: ParsedBill[] = [
    {
      vendor: 'ABC Corp.',
      date: '12/04/2024',
      amount: 250.00,
      currency: 'USD',
      category: 'Office Supplies'
    }
  ];

  return {
    transactions,
    kpiMetrics,
    chartData,
    expenseBreakdown,
    parsedBills
  };
};