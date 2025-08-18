import { useState, useEffect } from 'react';
import { Currency } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyRate {
  base_currency: string;
  target_currency: string;
  rate: number;
}

export const useCurrencyConverter = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const { data } = await supabase.functions.invoke('currency', {
        method: 'GET'
      });
      
      if (data?.rates) {
        setRates(data.rates);
      } else {
        // Fallback to default rates if API fails
        setRates([
          { base_currency: 'USD', target_currency: 'INR', rate: 85 },
          { base_currency: 'USD', target_currency: 'GBP', rate: 0.8 },
          { base_currency: 'INR', target_currency: 'USD', rate: 0.0118 },
          { base_currency: 'INR', target_currency: 'GBP', rate: 0.0094 },
          { base_currency: 'GBP', target_currency: 'USD', rate: 1.25 },
          { base_currency: 'GBP', target_currency: 'INR', rate: 106.25 },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch currency rates:', error);
      // Use fallback rates
      setRates([
        { base_currency: 'USD', target_currency: 'INR', rate: 85 },
        { base_currency: 'USD', target_currency: 'GBP', rate: 0.8 },
        { base_currency: 'INR', target_currency: 'USD', rate: 0.0118 },
        { base_currency: 'INR', target_currency: 'GBP', rate: 0.0094 },
        { base_currency: 'GBP', target_currency: 'USD', rate: 1.25 },
        { base_currency: 'GBP', target_currency: 'INR', rate: 106.25 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const convertAmount = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return amount;

    const rate = rates.find(r => 
      r.base_currency === fromCurrency && r.target_currency === toCurrency
    );

    if (rate) {
      return amount * rate.rate;
    }

    // Fallback conversion logic
    const fallbackRates: Record<string, number> = {
      'USD-INR': 85,
      'USD-GBP': 0.8,
      'INR-USD': 0.0118,
      'INR-GBP': 0.0094,
      'GBP-USD': 1.25,
      'GBP-INR': 106.25,
    };

    const rateKey = `${fromCurrency}-${toCurrency}`;
    return amount * (fallbackRates[rateKey] || 1);
  };

  return {
    rates,
    loading,
    convertAmount,
    refreshRates: fetchRates
  };
};