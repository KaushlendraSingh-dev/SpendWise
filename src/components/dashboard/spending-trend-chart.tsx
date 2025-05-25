
"use client";

import { LineChart as LineChartIcon, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useCalculatedData } from "@/hooks/use-data-store";
import { useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function SpendingTrendChart() {
  const { getSpendingOverTime } = useCalculatedData();
  const spendingOverTimeData = getSpendingOverTime();

  const chartData = useMemo(() => {
    return spendingOverTimeData.map(item => ({
      ...item,
    }));
  }, [spendingOverTimeData]);

  const currencyFormatter = (value: number) =>
    value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  
  const dateFormatter = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d");
    } catch {
      return dateStr; 
    }
  }


  if (chartData.length === 0) {
    return (
      <Card className={cn("shadow-lg hover:border-accent transition-colors duration-300 ease-in-out")}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-muted-foreground" />
            Spending Over Time
          </CardTitle>
          <CardDescription>
            Track your daily spending trends.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">
            No spending data available to show trends.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("shadow-lg hover:border-accent transition-colors duration-300 ease-in-out")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LineChartIcon className="mr-2 h-5 w-5 text-muted-foreground" />
          Spending Over Time
        </CardTitle>
        <CardDescription>
          Visualize your daily spending patterns.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20, 
              left: 10, 
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={dateFormatter}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={currencyFormatter}
              width={80} 
            />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-md)',
              }}
              labelFormatter={(label) => format(new Date(label), "PPP")} 
              formatter={(value: number) => [value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }), "Spent"]}
            />
            <Legend wrapperStyle={{fontSize: '12px'}}/>
            <Line
              type="monotone"
              dataKey="total"
              name="Total Spent"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
