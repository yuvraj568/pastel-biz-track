import { UploadBillsCard } from '@/components/UploadBillsCard';

export const Bills = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bills</h1>
      <UploadBillsCard />
    </div>
  );
};