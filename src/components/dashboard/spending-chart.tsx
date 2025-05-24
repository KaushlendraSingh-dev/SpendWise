
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCalculatedData } from "@/hooks/use-data-store";
import { useMemo } from "react";
import { PieChart } from "lucide-react"; // Added icon import

export function SpendingChart() {
  const { getSpendingByCategory } = useCalculatedData();
  const spendingData = getSpendingByCategory();

  const chartData = useMemo(() => {
    return Object.entries(spendingData)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total); // Sort by total descending
  }, [spendingData]);

  if (chartData.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="mr-2 h-5 w-5 text-muted-foreground" />
            Spending by Category
          </CardTitle>
          <CardDescription>Your spending breakdown will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No spending data available yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  const currencyFormatter = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="mr-2 h-5 w-5 text-muted-foreground" />
          Spending by Category
        </CardTitle>
        <CardDescription>Visualizing your expenses across different categories.</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={0} 
              angle={-30} 
              textAnchor="end"
              height={60} 
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={currencyFormatter}
              width={80} // Increased width for currency labels
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              formatter={(value: number) => currencyFormatter(value)}
            />
            <Legend wrapperStyle={{fontSize: '12px'}}/>
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total Spent" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
