
"use client";

import React from 'react'; 
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Expense, Budget, Category } from '@/lib/types'; // Removed DataStore as it's not directly used by Zustand type
import { siteConfig } from '@/config/site';
import { format } from "date-fns"; 

// Define what an empty state looks like
const emptyExpenses: Expense[] = [];
const emptyBudgets: Budget[] = [];

// Initial state for first-time load before any login/logout cycle
// Or for users who might use the app without "logging in" if public parts were available.
// For a strict login-required app, these might also be empty.
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
  clearUserData: () => void; // New function to clear data
};

const STORAGE_KEY = 'spendwise-storage';

export const useDataStore = create<AppState>()(
  persist(
    (set, get) => ({
      expenses: initialExpenses, // Load initial data
      budgets: initialBudgets,   // Load initial data

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
            b.id === updatedBudget.id ? { ...b, ...updatedBudget, spent: 0, remaining: 0 } : b 
          ),
        }));
      },
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },
      clearUserData: () => {
        set({ expenses: emptyExpenses, budgets: emptyBudgets });
        // Also explicitly clear the localStorage item if persist middleware doesn't handle this automatically on set
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY); 
          // Re-initialize with empty state to ensure persist picks it up if needed.
          // This line might be redundant if set({expenses: [], budgets: []}) is enough
          // for persist to overwrite the storage with an empty state.
          // However, explicitly removing ensures no old data lingers.
          // Then, to ensure the store is "re-persisted" as empty:
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: get().hasOwnProperty('version') ? (get() as any).version : 0, // maintain version if used by persist
            state: { expenses: emptyExpenses, budgets: emptyBudgets }
          }));
        }
      },
    }),
    {
      name: STORAGE_KEY, // Use the constant
      storage: createJSONStorage(() => localStorage),
      // Versioning can be useful for migrations if the shape of your stored data changes
      // version: 1, 
      // migrate: (persistedState, version) => { ... }
    }
  )
);

// Selectors
export const useCalculatedData = () => {
  const { expenses, budgets } = useDataStore();

  const getTotalSpending = React.useCallback(() => {
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

  const getBudgetProgress = React.useCallback((): Budget[] => {
    const spendingByCategoryData = getSpendingByCategory(); 
    return budgets.map(budget => {
      const spent = spendingByCategoryData[budget.category] || 0;
      const remaining = budget.amount - spent;
      return { ...budget, spent, remaining };
    });
  }, [budgets, getSpendingByCategory]);

  const getSpendingOverTime = React.useCallback(() => {
    if (expenses.length === 0) return [];
    const spendingByDate: Record<string, number> = {};
    expenses.forEach(exp => {
      try {
        const dateObj = new Date(exp.date);
        if (isNaN(dateObj.getTime())) {
          console.warn(\`Invalid date found for expense ID \${exp.id}: \${exp.date}\`);
          return; 
        }
        const dateKey = format(dateObj, 'yyyy-MM-dd');
        spendingByDate[dateKey] = (spendingByDate[dateKey] || 0) + exp.amount;
      } catch (e) {
        console.warn(\`Error processing date for expense ID \${exp.id}: \${exp.date}\`, e);
      }
    });
    
    return Object.entries(spendingByDate)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [expenses]);


  return { 
    expenses, 
    budgets, 
    getTotalSpending, 
    getSpendingByCategory, 
    getBudgetProgress, 
    getExpensesByCategory,
    getAllCategories,
    getSpendingOverTime, 
  };
};

// Call clearUserData on logout if needed, e.g., in AuthContext or a logout handler
// This is now handled within AuthContext signOut.
