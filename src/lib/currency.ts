import { Currency } from '@/types/transaction';

export const formatCurrency = (amount: number, currency: Currency): string => {
  const formatters = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
    GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
  };
  
  return formatters[currency].format(amount);
};

export const getCurrencySymbol = (currency: Currency): string => {
  const symbols = {
    USD: '$',
    INR: '₹',
    GBP: '£',
  };
  
  return symbols[currency];
};