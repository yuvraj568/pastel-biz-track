import { useState } from 'react';

interface ParsedBillData {
  vendor: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  description?: string;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [extractedBill, setExtractedBill] = useState<{ data: ParsedBillData; fileName: string } | null>(null);

  const extractBillData = (file: File): ParsedBillData => {
    // Mock AI extraction - in real implementation, this would call an AI service
    const vendors = ['Walmart', 'Amazon', 'Office Depot', 'Starbucks', 'Shell Gas Station', 'Dell', 'Adobe'];
    const categories = ['Office Supplies', 'Travel', 'Meals & Entertainment', 'Utilities', 'Equipment'];
    
    return {
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      date: new Date().toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 500) + 10,
      currency: 'USD',
      category: categories[Math.floor(Math.random() * categories.length)],
      description: `Expense from ${file.name}`
    };
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    // Simulate file processing time
    setTimeout(() => {
      const file = files[0]; // Process first file
      const extractedData = extractBillData(file);
      
      setExtractedBill({
        data: extractedData,
        fileName: file.name
      });
      
      setIsUploading(false);
    }, 2000);
  };

  const clearExtractedBill = () => {
    setExtractedBill(null);
  };

  return {
    isUploading,
    extractedBill,
    handleFileUpload,
    clearExtractedBill
  };
};