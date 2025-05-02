
import { BarChart as ReChartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlySpending } from '@/lib/types';
import { categoryTotals } from '@/lib/demo-data';

interface BarChartProps {
  data: MonthlySpending[];
}

export default function BarChart({ data }: BarChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsBar
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
          {categoryTotals.map((category) => (
            <Bar 
              key={category.category}
              dataKey={category.category} 
              fill={category.color}
              stackId="a" 
            />
          ))}
        </ReChartsBar>
      </ResponsiveContainer>
    </div>
  );
}
