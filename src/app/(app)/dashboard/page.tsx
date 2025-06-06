
'use client';

import { PageHeader } from '@/components/shared/page-header';
import { OverviewCard } from '@/components/dashboard/overview-card';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { BudgetProgressList } from '@/components/dashboard/budget-progress-list';
import { SpendingTrendChart } from '@/components/dashboard/spending-trend-chart';
import { DollarSign, ListChecks, TrendingUp, LayoutDashboard } from 'lucide-react';
import { useCalculatedData } from '@/hooks/use-data-store';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { getTotalSpending, getSpendingByCategory, getBudgetProgress } = useCalculatedData();

  const totalSpending = getTotalSpending();
  const spendingByCategory = getSpendingByCategory();
  const budgets = getBudgetProgress();

  const topSpendingCategory = useMemo(() => {
    const sortedCategories = Object.entries(spendingByCategory).sort(([, a], [, b]) => b - a);
    return sortedCategories.length > 0 ? sortedCategories[0][0] : 'N/A';
  }, [spendingByCategory]);
  
  const totalBudgeted = useMemo(() => budgets.reduce((sum, b) => sum + b.amount, 0) ,[budgets]);
  const totalSpentVsBudget = useMemo(() => budgets.reduce((sum, b) => sum + b.spent, 0) ,[budgets]);


  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your financial overview at a glance."
        icon={LayoutDashboard}
        imageUrl="https://cdn-icons-png.flaticon.com/512/8899/8899687.png"
        imageHint="dashboard icon"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <OverviewCard
          title="Total Spending"
          value={totalSpending}
          description="Sum of all your expenses"
          icon={DollarSign}
        />
        <OverviewCard
          title="Top Spending Category"
          value={topSpendingCategory}
          description={topSpendingCategory !== 'N/A' ? `Most money spent on ${topSpendingCategory}` : "No spending data"}
          icon={TrendingUp}
        />
        <OverviewCard
          title="Budget vs Actual"
          value={totalSpentVsBudget}
          description={`Against a total budget of ${totalBudgeted.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`}
          icon={ListChecks}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mb-6">
        <SpendingChart />
        <BudgetProgressList />
      </div>
      <div className="grid gap-6 md:grid-cols-1">
        <SpendingTrendChart />
      </div>
    </>
  );
}
