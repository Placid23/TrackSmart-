// src/ai/flows/adaptive-recommendations.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing adaptive recommendations
 * to users based on their spending patterns and financial goals.
 *
 * - adaptiveRecommendations - A function that generates personalized spending advice.
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
  spendingCategory: z
    .string()
    .describe('The category of spending (Good, Moderate, or Poor).'),
  recommendation: z
    .string()
    .describe('Personalized advice to improve financial management.'),
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
  prompt: `You are a financial advisor providing personalized recommendations.

Analyze the user's spending data and financial goals to give advice.

Spending Data: {{{spendingData}}}
Financial Goal: {{{financialGoal}}}
Monthly Allowance: {{{monthlyAllowance}}}

Classify the spending as Good, Moderate, or Poor and provide a recommendation based on it.

Ensure that the spendingCategory and recommendation are set appropriately.`,
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
