
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCalculatedData } from "@/hooks/use-data-store";
import type { Budget } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList } from "lucide-react"; 
import { cn } from "@/lib/utils";

export function BudgetProgressList() {
  const { getBudgetProgress } = useCalculatedData();
  const budgets = getBudgetProgress();

  if (budgets.length === 0) {
    return (
      <Card className={cn("shadow-lg hover:border-accent transition-colors duration-300 ease-in-out")}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5 text-muted-foreground" />
            Budget Progress
          </CardTitle>
          <CardDescription>Track how you're doing against your budget goals.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
           <p className="text-muted-foreground">No budgets set yet. Add budgets to see your progress.</p>
        </CardContent>
      </Card>
    );
  }
  
  const currencyFormatter = (value: number) => value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  return (
    <Card className={cn("shadow-lg hover:border-accent transition-colors duration-300 ease-in-out")}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClipboardList className="mr-2 h-5 w-5 text-muted-foreground" />
          Budget Progress
        </CardTitle>
        <CardDescription>Track how you're doing against your budget goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-3">
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
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={Math.min(progressValue, 100)} 
                      className={cn(
                        "flex-1 h-3", 
                        isOverBudget 
                          ? "[&>div]:bg-destructive" 
                          : progressValue >= 70
                          ? "[&>div]:bg-orange-500" 
                          : progressValue > 50 
                          ? "[&>div]:bg-yellow-400" 
                          : "" 
                      )} 
                    />
                    <span className="text-xs font-medium text-muted-foreground w-12 text-right">{Math.round(progressValue)}%</span>
                  </div>
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
