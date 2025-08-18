import { useState } from 'react';
import { ReportDetailModal } from './ReportDetailModal';

export const ReportsGrid = () => {
  const [selectedReport, setSelectedReport] = useState<{ type: string; name: string } | null>(null);

  const reports = [
    { name: 'Profit & Loss', description: 'Financial performance overview', type: 'profit_loss' },
    { name: 'Cash Flow', description: 'Money movement tracking', type: 'cash_flow' },
    { name: 'Balance Sheet', description: 'Assets and liabilities', type: 'balance_sheet' },
    { name: 'GST/VAT Sum', description: 'Tax summary report', type: 'gst_vat_summary' },
    { name: 'Expense by Category', description: 'Spending breakdown', type: 'expense_by_category' },
    { name: 'Income by Channel', description: 'Revenue sources', type: 'income_by_channel' },
  ];

  const openReport = (report: { name: string; type: string }) => {
    setSelectedReport({ type: report.type, name: report.name });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.name}
            onClick={() => openReport(report)}
            className="bg-card p-6 rounded-lg hover:bg-accent transition-colors cursor-pointer border"
          >
            <h3 className="text-lg font-semibold text-card-foreground mb-2">{report.name}</h3>
            <p className="text-muted-foreground">{report.description}</p>
          </div>
        ))}
      </div>

      {selectedReport && (
        <ReportDetailModal
          open={!!selectedReport}
          onOpenChange={() => setSelectedReport(null)}
          reportType={selectedReport.type}
          reportName={selectedReport.name}
        />
      )}
    </>
  );
};