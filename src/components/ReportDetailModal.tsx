import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ReportDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: string;
  reportName: string;
}

export const ReportDetailModal = ({ open, onOpenChange, reportType, reportName }: ReportDetailModalProps) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && reportType) {
      generateReport();
    }
  }, [open, reportType]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://pnxbqdwlqgcukwlfgclc.supabase.co/functions/v1/reports?type=${reportType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setReportData(result.data);
    } catch (error) {
      console.error('Error generating report:', error);
      setReportData({ error: 'Failed to generate report' });
    } finally {
      setLoading(false);
    }
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Generating report...</span>
        </div>
      );
    }

    if (!reportData) return null;

    if (reportData.error) {
      return <div className="text-destructive p-4">Error: {reportData.error}</div>;
    }

    switch (reportType) {
      case 'profit_loss':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-medium text-card-foreground">Total Income</h4>
                <p className="text-2xl font-bold text-green-600">${reportData.totalIncome?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-medium text-card-foreground">Total Expenses</h4>
                <p className="text-2xl font-bold text-red-600">${reportData.totalExpenses?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-medium text-card-foreground">Net Profit</h4>
                <p className="text-2xl font-bold text-primary">${reportData.netProfit?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-medium text-card-foreground">Profit Margin</h4>
                <p className="text-2xl font-bold text-primary">{reportData.profitMargin?.toFixed(2) || 0}%</p>
              </div>
            </div>
          </div>
        );

      case 'cash_flow':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Monthly Cash Flow</h4>
            <div className="space-y-2">
              {reportData?.map((month: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-card rounded-lg">
                  <span className="font-medium">{month.month}</span>
                  <div className="text-right">
                    <div className="text-green-600">Inflow: ${month.inflow?.toLocaleString() || 0}</div>
                    <div className="text-red-600">Outflow: ${month.outflow?.toLocaleString() || 0}</div>
                    <div className="font-bold">Net: ${month.netFlow?.toLocaleString() || 0}</div>
                  </div>
                </div>
              )) || <p>No cash flow data available</p>}
            </div>
          </div>
        );

      case 'expense_by_category':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Expenses by Category</h4>
            <div className="space-y-2">
              {reportData?.map((category: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-card rounded-lg">
                  <span className="font-medium">{category.category}</span>
                  <span className="font-bold">${category.amount?.toLocaleString() || 0}</span>
                </div>
              )) || <p>No expense data available</p>}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-card rounded-lg">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reportName}</DialogTitle>
          <DialogDescription>
            Detailed financial report analysis
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {renderReportContent()}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};