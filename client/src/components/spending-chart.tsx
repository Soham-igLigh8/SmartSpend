import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  TooltipProps
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Sample data for the chart
const monthlyData = [
  { name: "Apr", amount: 3200 },
  { name: "May", amount: 4100 },
  { name: "Jun", amount: 5200 },
  { name: "Jul", amount: 3800 },
  { name: "Aug", amount: 4700 },
  { name: "Sep", amount: 3500 },
  { name: "Oct", amount: 3200 },
];

// Categories data
const categories = [
  { name: "Housing", percentage: 32 },
  { name: "Food", percentage: 24 },
  { name: "Transport", percentage: 18 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-[#EBECF0] shadow-sm rounded text-sm">
        <p className="font-medium">{`${label}: ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(payload[0].value as number)}`}</p>
      </div>
    );
  }
  return null;
};

export default function SpendingChart() {
  const [timeRange, setTimeRange] = useState("30");
  
  // Find the highest value for highlighting
  const maxIndex = monthlyData.reduce(
    (maxIdx, item, idx, arr) => (item.amount > arr[maxIdx].amount ? idx : maxIdx),
    0
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Monthly Spending</CardTitle>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBECF0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#172B4D' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#172B4D' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === maxIndex ? '#FF5630' : '#0052CC'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          {categories.map((category) => (
            <div key={category.name} className="text-center p-2 bg-[#F4F5F7] rounded">
              <div className="text-sm text-gray-500">{category.name}</div>
              <div className="font-medium">{category.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
