import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TypeBadge = ({ type }: { type: Transaction['type'] }) => {
  const styles = {
    Income: 'bg-blue-100 text-blue-800',
    Expense: 'bg-red-100 text-red-800',
    Transfer: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[type])}>
      {type}
    </span>
  );
};

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <div className="bg-biztrack-light-blue p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-biztrack-accent-blue">
              <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Account</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Currency</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-biztrack-accent-blue/50">
                <td className="py-3 px-4">{transaction.id}</td>
                <td className="py-3 px-4">{transaction.date}</td>
                <td className="py-3 px-4">
                  <TypeBadge type={transaction.type} />
                </td>
                <td className="py-3 px-4">{transaction.account}</td>
                <td className="py-3 px-4">{transaction.category}</td>
                <td className="py-3 px-4 font-medium">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </td>
                <td className="py-3 px-4">{transaction.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};