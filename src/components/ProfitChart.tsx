import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/types/transaction';

interface ProfitChartProps {
  data: ChartDataPoint[];
}

export const ProfitChart = ({ data }: ProfitChartProps) => {
  return (
    <div className="bg-biztrack-light-blue p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#A0DEFF" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#CAF4FF', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#5AB2FF" 
              strokeWidth={3} 
              dot={{ fill: '#5AB2FF', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#A0DEFF" 
              strokeWidth={2} 
              dot={{ fill: '#A0DEFF', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};