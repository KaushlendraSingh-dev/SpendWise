'use server';

import { z } from 'zod';
import { suggestExpenseCategory as suggestExpenseCategoryFlow } from '@/ai/flows/suggest-expense-category';
import type { SuggestExpenseCategoryInput, SuggestExpenseCategoryOutput } from '@/ai/flows/suggest-expense-category';

const SuggestCategorySchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters long."),
});

export async function handleSuggestCategoryAction(
  prevState: any,
  formData: FormData
): Promise<{ category?: string; confidence?: number; error?: string }> {
  const validatedFields = SuggestCategorySchema.safeParse({
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.description?.[0] || "Invalid description.",
    };
  }
  
  const input: SuggestExpenseCategoryInput = { description: validatedFields.data.description };

  try {
    const result: SuggestExpenseCategoryOutput = await suggestExpenseCategoryFlow(input);
    return { category: result.category, confidence: result.confidence };
  } catch (error) {
    console.error("AI Category Suggestion Error:", error);
    return { error: "Failed to suggest category. Please try again." };
  }
}

// Future server actions for adding/updating expenses and budgets would go here.
// For now, data is managed client-side via useDataStore.
// Example structure:
/*
export async function addExpenseAction(data: Omit<Expense, 'id'>) {
  // In a real app, this would interact with a database
  // For this demo, it could potentially interact with a server-side store if not using client-side only
  console.log("Adding expense (server action):", data);
  // Simulate adding to a database and returning the new expense
  const newExpense = { ...data, id: crypto.randomUUID() };
  return { success: true, expense: newExpense };
}
*/
