export const ReportsGrid = () => {
  const reports = [
    { name: 'Profit & Loss', description: 'Financial performance overview' },
    { name: 'Cash Flow', description: 'Money movement tracking' },
    { name: 'Balance Sheet', description: 'Assets and liabilities' },
    { name: 'GST/VAT Sum', description: 'Tax summary report' },
    { name: 'Expense by Category', description: 'Spending breakdown' },
    { name: 'Income by Channel', description: 'Revenue sources' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div
          key={report.name}
          className="bg-biztrack-light-blue p-6 rounded-lg hover:bg-biztrack-accent-blue transition-colors cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.name}</h3>
          <p className="text-gray-600">{report.description}</p>
        </div>
      ))}
    </div>
  );
};