
import { PieChart as ReChartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryTotal } from '@/lib/types';

interface PieChartProps {
  data: CategoryTotal[];
}

export default function PieChart({ data }: PieChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsPie data={data}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="total"
            nameKey="category"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} 
            labelFormatter={(name) => `Category: ${name}`}
          />
          <Legend />
        </ReChartsPie>
      </ResponsiveContainer>
    </div>
  );
}
