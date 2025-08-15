export interface Transaction {
  id: string;
  date: string;
  type: 'Income' | 'Expense' | 'Transfer';
  account: string;
  category: string;
  amount: number;
  currency: 'USD' | 'INR' | 'GBP';
  description?: string;
}

export interface KPIMetrics {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ExpenseBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface ParsedBill {
  vendor: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
}

export type Currency = 'USD' | 'INR' | 'GBP';
export type UserRole = 'Admin' | 'Accountant' | 'Employee';