
"use client";

import React from 'react';
import { create } from 'zustand';
import type { Expense, Budget, Category } from '@/lib/types';
import { siteConfig } from '@/config/site';
import { format } from "date-fns";
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  writeBatch,
} from 'firebase/firestore';

type AppState = {
  expenses: Expense[];
  budgets: Budget[];
  isLoading: boolean;
  isInitialized: boolean; // Tracks if user data has been loaded for the current session
  userId: string | null; // Store current user ID

  initializeUserSession: (userId: string) => Promise<void>;
  clearUserSession: () => void;

  addExpense: (expenseData: Omit<Expense, 'id' | 'date'> & { date: Date }) => Promise<Expense | null>;
  updateExpense: (expenseData: Omit<Expense, 'date'> & { date: Date }) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  addBudget: (budgetData: Omit<Budget, 'id' | 'spent' | 'remaining'>) => Promise<Budget | null>;
  updateBudget: (budgetData: Omit<Budget, 'id' | 'spent' | 'remaining'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
};

const useDataStore = create<AppState>((set, get) => ({
  expenses: [],
  budgets: [],
  isLoading: false,
  isInitialized: false,
  userId: null,

  initializeUserSession: async (userId) => {
    if (get().isInitialized && get().userId === userId) return; // Already initialized for this user

    set({ isLoading: true, userId, isInitialized: false });
    try {
      const expensesQuery = query(
        collection(db, `users/${userId}/expenses`),
        orderBy("date", "desc")
      );
      const expensesSnapshot = await getDocs(expensesQuery);
      const userExpenses: Expense[] = expensesSnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          date: (data.date as Timestamp).toDate().toISOString(),
        } as Expense;
      });

      const budgetsQuery = query(collection(db, `users/${userId}/budgets`));
      const budgetsSnapshot = await getDocs(budgetsQuery);
      const userBudgets: Budget[] = budgetsSnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          spent: 0, // Will be recalculated
          remaining: 0, // Will be recalculated
        } as Budget;
      });

      set({ expenses: userExpenses, budgets: userBudgets, isLoading: false, isInitialized: true });
    } catch (error) {
      console.error("Error loading user data from Firestore:", error);
      set({ isLoading: false, isInitialized: false }); // Indicate loading failed but session was attempted
    }
  },

  clearUserSession: () => {
    set({ expenses: [], budgets: [], isLoading: false, isInitialized: false, userId: null });
  },

  addExpense: async (expenseData) => {
    const userId = get().userId;
    if (!userId) {
      console.error("No user ID found, cannot add expense.");
      return null;
    }
    set({ isLoading: true });
    try {
      const docRef = await addDoc(collection(db, `users/${userId}/expenses`), {
        ...expenseData,
        date: Timestamp.fromDate(expenseData.date), // Store as Firestore Timestamp
      });
      const newExpense: Expense = {
        id: docRef.id,
        ...expenseData,
        date: expenseData.date.toISOString(), // Keep ISO string in local state for consistency
      };
      set((state) => ({
        expenses: [...state.expenses, newExpense].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        isLoading: false,
      }));
      return newExpense;
    } catch (error) {
      console.error("Error adding expense to Firestore:", error);
      set({ isLoading: false });
      return null;
    }
  },

  updateExpense: async (expenseData) => {
    const userId = get().userId;
    if (!userId) {
      console.error("No user ID found, cannot update expense.");
      return;
    }
    set({ isLoading: true });
    try {
      const expenseRef = doc(db, `users/${userId}/expenses`, expenseData.id);
      await updateDoc(expenseRef, {
        ...expenseData,
        date: Timestamp.fromDate(expenseData.date),
      });
      const updatedExpense: Expense = {
        ...expenseData,
        date: expenseData.date.toISOString(),
      };
      set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp.id === updatedExpense.id ? updatedExpense : exp
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating expense in Firestore:", error);
      set({ isLoading: false });
    }
  },

  deleteExpense: async (id) => {
    const userId = get().userId;
    if (!userId) {
      console.error("No user ID found, cannot delete expense.");
      return;
    }
    set({ isLoading: true });
    try {
      await deleteDoc(doc(db, `users/${userId}/expenses`, id));
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting expense from Firestore:", error);
      set({ isLoading: false });
    }
  },

  addBudget: async (budgetData) => {
    const userId = get().userId;
    if (!userId) {
      console.error("No user ID found, cannot add budget.");
      return null;
    }
    set({ isLoading: true });
    try {
      const docRef = await addDoc(collection(db, `users/${userId}/budgets`), budgetData);
      const newBudget: Budget = {
        id: docRef.id,
        ...budgetData,
        spent: 0,
        remaining: budgetData.amount,
      };
      set((state) => ({
        budgets: [...state.budgets, newBudget],
        isLoading: false,
      }));
      return newBudget;
    } catch (error) {
      console.error("Error adding budget to Firestore:", error);
      set({ isLoading: false });
      return null;
    }
  },

  updateBudget: async (budgetData) => {
    const userId = get().userId;
    if (!userId) {
      console.error("No user ID found, cannot update budget.");
      return;
    }
    set({ isLoading: true });
    try {
      const budgetRef = doc(db, `users/${userId}/budgets`, budgetData.id);
      await updateDoc(budgetRef, budgetData);
      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === budgetData.id ? { ...b, ...budgetData } : b // spent/remaining will be recalculated by selectors
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating budget in Firestore:", error);
      set({ isLoading: false });
    }
  },

  deleteBudget: async (id) => {
    const userId = get().userId;
    if (!userId) {
      console.error("No user ID found, cannot delete budget.");
      return;
    }
    set({ isLoading: true });
    try {
      await deleteDoc(doc(db, `users/${userId}/budgets`, id));
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting budget from Firestore:", error);
      set({ isLoading: false });
    }
  },
}));

// Selectors remain largely the same, but now depend on the Zustand state that's populated from Firestore
export const useCalculatedData = () => {
  const { expenses, budgets, isLoading, isInitialized } = useDataStore();

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
          console.warn("Invalid date found for expense ID " + exp.id + ": " + exp.date);
          return;
        }
        const dateKey = format(dateObj, 'yyyy-MM-dd');
        spendingByDate[dateKey] = (spendingByDate[dateKey] || 0) + exp.amount;
      } catch (e) {
        console.warn("Error processing date for expense ID " + exp.id + ": " + exp.date, e);
      }
    });

    return Object.entries(spendingByDate)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [expenses]);


  return {
    expenses,
    budgets,
    isLoading,
    isInitialized,
    getTotalSpending,
    getSpendingByCategory,
    getBudgetProgress,
    getExpensesByCategory,
    getAllCategories,
    getSpendingOverTime,
  };
};

export { useDataStore };
