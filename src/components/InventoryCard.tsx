import { Link, RefreshCw } from 'lucide-react';

export const InventoryCard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-biztrack-light-blue p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Integration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Link Status</span>
            <span className="text-green-600 font-medium">Connected</span>
          </div>
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 bg-biztrack-primary-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
              <Link className="w-4 h-4" />
              <span>Link</span>
            </button>
            <button className="flex items-center space-x-2 bg-biztrack-accent-blue text-gray-800 px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-biztrack-light-blue p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost of Goods Sold (COGS)</h3>
        <p className="text-gray-600 mb-4">
          Inventory integration enables automatic COGS calculation based on product sales and stock movements.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Items</span>
            <span className="font-medium">1,234</span>
          </div>
          <div className="flex justify-between">
            <span>Total Value</span>
            <span className="font-medium">$45,678</span>
          </div>
          <div className="flex justify-between">
            <span>This Month COGS</span>
            <span className="font-medium">$12,345</span>
          </div>
        </div>
      </div>
    </div>
  );
};