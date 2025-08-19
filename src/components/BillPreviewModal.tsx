import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useTransactions } from '@/contexts/TransactionContext';

interface ParsedBillData {
  vendor: string;
  date: string;
  amount: number;
  currency: string;
  category: string;
  description?: string;
}

interface BillPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extractedData: ParsedBillData;
  fileName: string;
}

export const BillPreviewModal = ({ open, onOpenChange, extractedData, fileName }: BillPreviewModalProps) => {
  const [editedData, setEditedData] = useState<ParsedBillData>(extractedData);
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      // Add as expense transaction
      await addTransaction({
        description: editedData.description || `Bill from ${editedData.vendor}`,
        amount: editedData.amount,
        type: 'Expense',
        category: editedData.category,
        date: editedData.date,
        account: 'Main Account',
        currency: editedData.currency as 'USD' | 'INR' | 'GBP'
      });

      toast({
        title: "Bill Added Successfully",
        description: `Bill from ${editedData.vendor} has been added to your transactions.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error adding bill:', error);
      toast({
        title: "Error",
        description: "Failed to add bill to transactions.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Extracted Bill Data</DialogTitle>
          <DialogDescription>
            File: {fileName} - Please review and edit the extracted information before confirming.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={editedData.vendor}
                onChange={(e) => setEditedData(prev => ({ ...prev, vendor: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={editedData.date}
                onChange={(e) => setEditedData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={editedData.amount}
                onChange={(e) => setEditedData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={editedData.currency} 
                onValueChange={(value) => setEditedData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={editedData.category} 
              onValueChange={(value) => setEditedData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Meals & Entertainment">Meals & Entertainment</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Professional Services">Professional Services</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Additional notes about this expense"
              value={editedData.description || ''}
              onChange={(e) => setEditedData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm & Add to Transactions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};