
'use server';
/**
 * @fileOverview Provides financial tips.
 *
 * - getFinancialTips - A function that returns a list of financial tips.
 * - GetFinancialTipsInput - The input type for the getFinancialTips function (currently void).
 * - GetFinancialTipsOutput - The return type for the getFinancialTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema is void as we are generating general tips for now.
const GetFinancialTipsInputSchema = z.void();
export type GetFinancialTipsInput = z.infer<typeof GetFinancialTipsInputSchema>;

const GetFinancialTipsOutputSchema = z.object({
  tips: z.array(z.string().describe("A single, actionable financial tip.")).describe("A list of financial tips."),
});
export type GetFinancialTipsOutput = z.infer<typeof GetFinancialTipsOutputSchema>;

export async function getFinancialTips(input?: GetFinancialTipsInput): Promise<GetFinancialTipsOutput> {
  return getFinancialTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFinancialTipsPrompt',
  input: {schema: GetFinancialTipsInputSchema},
  output: {schema: GetFinancialTipsOutputSchema},
  prompt: `You are a creative and insightful financial advisor. Your goal is to provide a fresh set of 3-5 diverse financial tips each time you are asked. The tips should be concise, actionable, encouraging, and easy to understand for someone looking to better manage their personal expenses and stick to a budget.

Please ensure the tips you provide in this response are different from tips you might have provided in previous, similar requests. Focus on variety.

Consider tips related to:
- Smart saving strategies
- Budgeting techniques (beyond the common ones)
- Mindful spending habits
- Understanding financial products
- Small steps towards long-term financial health

For example:
- "Regularly review your subscriptions and cancel any you no longer use."
- "Try the 50/30/20 budget rule: 50% for needs, 30% for wants, and 20% for savings."
- "Set specific, measurable financial goals to stay motivated."

Generate a list of unique and varied tips.`,
  config: {
    temperature: 0.9, // Encourage more varied responses
  },
});

const getFinancialTipsFlow = ai.defineFlow(
  {
    name: 'getFinancialTipsFlow',
    inputSchema: GetFinancialTipsInputSchema,
    outputSchema: GetFinancialTipsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
