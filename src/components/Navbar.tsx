import { Search, Plus } from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import { CurrencySelector } from './CurrencySelector';
import { NewTransactionModal } from './NewTransactionModal';
import { useState } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useTransactions();
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-800">BizTrack</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <RoleBadge role="Admin" />
          <CurrencySelector />
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-biztrack-primary-blue"
            />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-biztrack-primary-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>
      </div>
      <NewTransactionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </header>
  );
};