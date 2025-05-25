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
  prompt: `You are a helpful financial advisor. Please provide 3-5 concise and actionable financial tips for someone looking to better manage their personal expenses and stick to a budget. The tips should be encouraging and easy to understand.

For example:
- "Regularly review your subscriptions and cancel any you no longer use."
- "Try the 50/30/20 budget rule: 50% for needs, 30% for wants, and 20% for savings."
- "Set specific, measurable financial goals to stay motivated."

Generate a list of unique tips.`,
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
