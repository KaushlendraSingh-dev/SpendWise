"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCalculatedData } from "@/hooks/use-data-store";
import type { Budget } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BudgetProgressList() {
  const { getBudgetProgress } = useCalculatedData();
  const budgets = getBudgetProgress();

  if (budgets.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
          <CardDescription>Track how you're doing against your budget goals.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
           <p className="text-muted-foreground">No budgets set yet. Add budgets to see your progress.</p>
        </CardContent>
      </Card>
    );
  }
  
  const currencyFormatter = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>Track how you're doing against your budget goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-3"> {/* Adjust height as needed */}
          <div className="space-y-6">
            {budgets.map((budget: Budget) => {
              const progressValue = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
              const isOverBudget = budget.spent > budget.amount;
              return (
                <div key={budget.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-foreground">{budget.category}</span>
                    <span className={`text-xs ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {currencyFormatter(budget.spent)} / {currencyFormatter(budget.amount)}
                    </span>
                  </div>
                  <Progress value={Math.min(progressValue, 100)} className={cn(isOverBudget ? "[&>div]:bg-destructive" : "")} />
                  <p className="text-xs text-muted-foreground text-right">
                    {isOverBudget 
                      ? `${currencyFormatter(budget.spent - budget.amount)} over budget`
                      : `${currencyFormatter(budget.remaining)} remaining`}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";
