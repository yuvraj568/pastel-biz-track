import { InventoryCard } from '@/components/InventoryCard';

export const Inventory = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory</h1>
      <InventoryCard />
    </div>
  );
};