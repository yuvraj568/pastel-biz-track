import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Currency } from '@/types/transaction';
import { useCurrency } from '@/contexts/CurrencyContext';

interface NewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewTransactionModal = ({ open, onOpenChange }: NewTransactionModalProps) => {
  const { selectedCurrency } = useCurrency();
  const [formData, setFormData] = useState({
    type: '',
    account: '',
    category: '',
    amount: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new transaction:', formData);
    onOpenChange(false);
    setFormData({
      type: '',
      account: '',
      category: '',
      amount: '',
      description: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="account">Account</Label>
            <Input
              id="account"
              value={formData.account}
              onChange={(e) => setFormData(prev => ({ ...prev, account: e.target.value }))}
              placeholder="Account name"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Category"
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount ({selectedCurrency})</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Transaction description"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};