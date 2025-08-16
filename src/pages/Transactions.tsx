import { useState } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionsTable } from '@/components/TransactionsTable';

export const Transactions = () => {
  const { transactions, loading } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Transactions</h1>
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-300 rounded-lg"></div>
            <div className="h-64 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Transactions</h1>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-biztrack-primary-blue"
            />
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-biztrack-light-blue rounded-lg hover:bg-biztrack-accent-blue transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-biztrack-light-blue rounded-lg hover:bg-biztrack-accent-blue transition-colors">
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
};