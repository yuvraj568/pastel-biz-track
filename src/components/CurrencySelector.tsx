import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Currency } from '@/types/transaction';
import { useCurrency } from '@/contexts/CurrencyContext';

export const CurrencySelector = () => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currencies: Currency[] = ['USD', 'INR', 'GBP'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-biztrack-light-blue rounded-lg hover:bg-biztrack-accent-blue transition-colors"
      >
        <span className="font-medium">{selectedCurrency}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {currencies.map((currency) => (
            <button
              key={currency}
              onClick={() => {
                setSelectedCurrency(currency);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-biztrack-light-blue first:rounded-t-lg last:rounded-b-lg"
            >
              {currency}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};