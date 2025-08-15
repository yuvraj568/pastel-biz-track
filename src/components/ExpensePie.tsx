import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ExpenseBreakdown } from '@/types/transaction';

interface ExpensePieProps {
  data: ExpenseBreakdown[];
}

export const ExpensePie = ({ data }: ExpensePieProps) => {
  return (
    <div className="bg-biztrack-light-blue p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#CAF4FF', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};