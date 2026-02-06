// src/ai/flows/adaptive-recommendations.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing adaptive recommendations
 * to users based on their spending patterns and financial goals, acting as a Decision Tree Prediction Module.
 *
 * - adaptiveRecommendations - A function that generates a spending score and personalized advice.
 * - AdaptiveRecommendationsInput - The input type for the adaptiveRecommendations function.
 * - AdaptiveRecommendationsOutput - The return type for the adaptiveRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveRecommendationsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A stringified JSON array containing the user spending data, including transaction amount, vendor category, coupon usage, cash usage, date, and time.'
    ),
  financialGoal: z
    .string()
    .describe('The user specified financial goals (e.g., save more, reduce debt).'),
  monthlyAllowance: z.number().describe('The user monthly allowance amount.'),
});
export type AdaptiveRecommendationsInput = z.infer<
  typeof AdaptiveRecommendationsInputSchema
>;

const AdaptiveRecommendationsOutputSchema = z.object({
  spendingDisciplineLevel: z
    .enum(['Good', 'Moderate', 'Poor'])
    .describe('The predicted user spending discipline level.'),
  spendingScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A generated spending score from 0 to 100, where 100 represents perfect discipline.'),
  advisoryFeedback: z
    .string()
    .describe('Short advisory feedback based on the prediction.'),
});

export type AdaptiveRecommendationsOutput = z.infer<
  typeof AdaptiveRecommendationsOutputSchema
>;

export async function adaptiveRecommendations(
  input: AdaptiveRecommendationsInput
): Promise<AdaptiveRecommendationsOutput> {
  return adaptiveRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveRecommendationsPrompt',
  input: {schema: AdaptiveRecommendationsInputSchema},
  output: {schema: AdaptiveRecommendationsOutputSchema},
  prompt: `You are an analytical AI module that functions like a decision tree to predict spending behavior.
Your task is to analyze a user's spending data, their financial goals, and their monthly allowance to assess their financial discipline.

Based on your analysis, you must predict the following:
1.  **spendingDisciplineLevel**: Classify the user's spending discipline as 'Good', 'Moderate', or 'Poor'.
2.  **spendingScore**: Generate a numerical score from 0 to 100 representing their discipline. A high score means they are meeting their goals and staying within budget. A low score indicates overspending or spending that contradicts their goals.
3.  **advisoryFeedback**: Provide short, actionable advisory feedback based on the prediction.

Here is the data for your analysis:
User's Monthly Allowance: {{{monthlyAllowance}}}
User's Stated Financial Goal: "{{{financialGoal}}}"
User's Historical Spending Data (JSON): {{{spendingData}}}

Analyze this data to predict the likelihood of overspending and determine the discipline level. Generate the score and feedback accordingly.
Ensure the output is a valid JSON object matching the defined schema.`,
});

const adaptiveRecommendationsFlow = ai.defineFlow(
  {
    name: 'adaptiveRecommendationsFlow',
    inputSchema: AdaptiveRecommendationsInputSchema,
    outputSchema: AdaptiveRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
