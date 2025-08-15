import { Upload } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useMockData } from '@/hooks/useMockData';

export const UploadBillsCard = () => {
  const { isUploading, handleFileUpload } = useFileUpload();
  const { parsedBills } = useMockData();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className="border-2 border-dashed border-biztrack-accent-blue bg-biztrack-light-blue p-8 rounded-lg text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Bills/Receipts</h3>
        <p className="text-gray-600 mb-4">Supported formats: PDF, JPG, PNG</p>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-biztrack-primary-blue text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-opacity-90 transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Choose Files'}
        </label>
      </div>

      <div className="bg-biztrack-light-blue p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Parsed Bills</h3>
        {parsedBills.map((bill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Vendor</span>
              <span>{bill.vendor}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date</span>
              <span>{bill.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount</span>
              <span>{bill.currency} {bill.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Category</span>
              <span>{bill.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};