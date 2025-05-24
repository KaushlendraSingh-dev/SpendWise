import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  label?: string;
  description?: string;
};

export type Category = string;

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // ISO string date
}

export interface Budget {
  id: string;
  category: Category;
  amount: number;
  spent: number; // Calculated dynamically
  remaining: number; // Calculated dynamically
}

export interface DataStore {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id'>) => Expense;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent' | 'remaining'>) => Budget;
  updateBudget: (budget: Omit<Budget, 'spent' | 'remaining'>) => void;
  deleteBudget: (id: string) => void;
  getExpensesByCategory: (category: Category) => Expense[];
  getTotalSpending: () => number;
  getSpendingByCategory: () => Record<Category, number>;
  getBudgetProgress: () => Budget[];
}
