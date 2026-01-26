'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized spending advice.
 *
 * The flow analyzes user's spending habits and classifies them as 'Good', 'Moderate', or 'Poor',
 * providing insights and recommendations based on the analysis.
 *
 * @exports {personalizedSpendingAdvice} - The main function to trigger the flow.
 * @exports {PersonalizedSpendingAdviceInput} - The input type for the personalizedSpendingAdvice function.
 * @exports {PersonalizedSpendingAdviceOutput} - The output type for the personalizedSpendingAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSpendingAdviceInputSchema = z.object({
  expenses: z.array(
    z.object({
      amount: z.number().describe('The amount spent in this transaction.'),
      vendorCategory: z.string().describe('The category of the vendor.'),
      couponUsed: z.boolean().describe('Whether a coupon was used for this transaction.'),
      cashUsed: z.boolean().describe('Whether cash was used for this transaction.'),
      date: z.string().describe('The date of the transaction.'),
      time: z.string().describe('The time of the transaction.'),
    })
  ).describe('An array of expense objects.'),
  monthlyAllowance: z.number().describe('The user\u2019s monthly allowance amount.'),
});
export type PersonalizedSpendingAdviceInput = z.infer<typeof PersonalizedSpendingAdviceInputSchema>;

const PersonalizedSpendingAdviceOutputSchema = z.object({
  spendingClassification: z
    .enum(['Good', 'Moderate', 'Poor'])
    .describe('Classification of the user\u2019s spending habits.'),
  insights: z.string().describe('Personalized insights based on the spending habits.'),
  recommendations: z.string().describe('Adaptive recommendations for better spending habits.'),
});
export type PersonalizedSpendingAdviceOutput = z.infer<typeof PersonalizedSpendingAdviceOutputSchema>;

export async function personalizedSpendingAdvice(
  input: PersonalizedSpendingAdviceInput
): Promise<PersonalizedSpendingAdviceOutput> {
  return personalizedSpendingAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSpendingAdvicePrompt',
  input: {schema: PersonalizedSpendingAdviceInputSchema},
  output: {schema: PersonalizedSpendingAdviceOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending habits and provide personalized advice.

Here's the user's monthly allowance: {{monthlyAllowance}}
Here are the user's expenses:
{{#each expenses}}
  - Amount: {{amount}}, Vendor Category: {{vendorCategory}}, Coupon Used: {{couponUsed}}, Cash Used: {{cashUsed}}, Date: {{date}}, Time: {{time}}
{{/each}}

Classify the user's spending as 'Good', 'Moderate', or 'Poor'.
Provide insights into their spending habits, highlighting areas of concern and potential improvements.
Offer adaptive recommendations to help them better manage their finances.

Ensure that the output strictly conforms to the JSON schema.
{
  "spendingClassification": "...",
  "insights": "...",
  "recommendations": "..."
}
`,
});

const personalizedSpendingAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedSpendingAdviceFlow',
    inputSchema: PersonalizedSpendingAdviceInputSchema,
    outputSchema: PersonalizedSpendingAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
