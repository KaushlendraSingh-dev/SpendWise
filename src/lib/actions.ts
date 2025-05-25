'use server';

import { z } from 'zod';
import { suggestExpenseCategory as suggestExpenseCategoryFlow } from '@/ai/flows/suggest-expense-category';
import type { SuggestExpenseCategoryInput, SuggestExpenseCategoryOutput } from '@/ai/flows/suggest-expense-category';
import { getFinancialTips as getFinancialTipsFlow } from '@/ai/flows/get-financial-tips-flow';
import type { GetFinancialTipsOutput } from '@/ai/flows/get-financial-tips-flow';

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

export async function handleGetFinancialTipsAction(
  prevState: any,
  formData?: FormData // formData might not be used for this action
): Promise<{ tips?: string[]; error?: string }> {
  try {
    const result: GetFinancialTipsOutput = await getFinancialTipsFlow();
    return { tips: result.tips };
  } catch (error) {
    console.error("AI Financial Tips Error:", error);
    return { error: "Failed to fetch financial tips. Please try again." };
  }
}
