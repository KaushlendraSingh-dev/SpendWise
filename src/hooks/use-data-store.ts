
"use client";

import React from 'react'; // Added React import for useCallback
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Expense, Budget, Category, DataStore } from '@/lib/types';
import { siteConfig } from '@/config/site';

const initialExpenses: Expense[] = [
  { id: '1', description: 'Groceries', amount: 75.50, category: 'Food & Drinks', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', description: 'Train ticket', amount: 22.00, category: 'Transportation', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', description: 'Movie night', amount: 40.00, category: 'Entertainment', date: new Date().toISOString() },
];

const initialBudgets: Budget[] = [
  { id: 'b1', category: 'Food & Drinks', amount: 400, spent: 0, remaining: 0 },
  { id: 'b2', category: 'Entertainment', amount: 150, spent: 0, remaining: 0 },
];

type AppState = {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id'>) => Expense;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent' | 'remaining'>) => Budget;
  updateBudget: (budget: Omit<Budget, 'spent' | 'remaining'>) => void;
  deleteBudget: (id: string) => void;
};

export const useDataStore = create<AppState>()(
  persist(
    (set, get) => ({
      expenses: initialExpenses,
      budgets: initialBudgets,

      addExpense: (expense) => {
        const newExpense = { ...expense, id: crypto.randomUUID() };
        set((state) => ({ expenses: [...state.expenses, newExpense].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }));
        return newExpense;
      },
      updateExpense: (updatedExpense) => {
        set((state) => ({
          expenses: state.expenses.map((exp) =>
            exp.id === updatedExpense.id ? updatedExpense : exp
          ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        }));
      },
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id),
        }));
      },

      addBudget: (budget) => {
        const newBudget = { ...budget, id: crypto.randomUUID(), spent: 0, remaining: budget.amount };
        set((state) => ({ budgets: [...state.budgets, newBudget] }));
        return newBudget;
      },
      updateBudget: (updatedBudget) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === updatedBudget.id ? { ...b, ...updatedBudget, spent: 0, remaining: 0 } : b // spent/remaining recalculated elsewhere
          ),
        }));
      },
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },
    }),
    {
      name: 'spendwise-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selectors - these are not part of the persisted store but derive state
export const useCalculatedData = () => {
  const { expenses, budgets } = useDataStore();

  const getTotalSpending = React.useCallback((period?: 'month' | 'year') => {
    // Simple total for now, can be enhanced with period filtering
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const getSpendingByCategory = React.useCallback(() => {
    const spending: Record<Category, number> = {};
    expenses.forEach(exp => {
      spending[exp.category] = (spending[exp.category] || 0) + exp.amount;
    });
    return spending;
  }, [expenses]);
  
  const getExpensesByCategory = React.useCallback((category: Category) => {
    return expenses.filter(exp => exp.category === category);
  }, [expenses]);

  const getAllCategories = React.useCallback(() => {
    const categoriesFromExpenses = expenses.map(e => e.category);
    const categoriesFromBudgets = budgets.map(b => b.category);
    const allUniqueCategories = Array.from(new Set([...siteConfig.defaultCategories, ...categoriesFromExpenses, ...categoriesFromBudgets]));
    return allUniqueCategories.sort();
  }, [expenses, budgets]);

  const getBudgetProgress = React.useCallback(() : Budget[] => {
    const spendingByCategoryData = getSpendingByCategory(); // Uses the memoized version
    return budgets.map(budget => {
      const spent = spendingByCategoryData[budget.category] || 0;
      const remaining = budget.amount - spent;
      return { ...budget, spent, remaining };
    });
  }, [budgets, getSpendingByCategory]);


  return { 
    expenses, 
    budgets, 
    getTotalSpending, 
    getSpendingByCategory, 
    getBudgetProgress, 
    getExpensesByCategory,
    getAllCategories
  };
};
