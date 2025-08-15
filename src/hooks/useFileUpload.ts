import { useState } from 'react';
import { ParsedBill } from '@/types/transaction';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    // Simulate upload and parsing process
    setTimeout(() => {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
      setIsUploading(false);
    }, 2000);
  };

  const mockParseBill = (file: File): ParsedBill => {
    return {
      vendor: 'ABC Corp.',
      date: '12/04/2024',
      amount: 250.00,
      currency: 'USD',
      category: 'Office Supplies'
    };
  };

  return {
    isUploading,
    uploadedFiles,
    handleFileUpload,
    mockParseBill
  };
};