'use server';
/**
 * @fileOverview A smart wellbeing advice AI agent.
 *
 * - getSmartWellbeingAdvice - A function that generates smart wellbeing advice based on patient profile and respiration data.
 * - SmartWellbeingAdviceInput - The input type for the getSmartWellbeingAdvice function.
 * - SmartWellbeingAdviceOutput - The return type for the getSmartWellbeingAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartWellbeingAdviceInputSchema = z.object({
  age: z.number().describe('The age of the patient.'),
  gender: z.string().describe('The gender of the patient.'),
  weight: z.number().describe('The weight of the patient in kilograms.'),
  pastDisease: z.string().optional().describe('Any past disease that affects respiration rate.'),
  activityLevel: z.string().describe('The activity level of the patient (e.g., sedentary, moderate, active).'),
  bodyPosture: z.string().describe('The body posture of the patient (e.g., sitting, standing, lying down).'),
  stressLevel: z.string().describe('The stress level of the patient (e.g., low, moderate, high).'),
  hydrationStatus: z.string().describe('The hydration status of the patient (e.g., well-hydrated, dehydrated).'),
  respirationRate: z.number().describe('The respiration rate of the patient in breaths per minute.'),
});
export type SmartWellbeingAdviceInput = z.infer<typeof SmartWellbeingAdviceInputSchema>;

const SmartWellbeingAdviceOutputSchema = z.object({
  advice: z.string().describe('Smart, contextual wellbeing advice based on the patient profile and respiration data.'),
});
export type SmartWellbeingAdviceOutput = z.infer<typeof SmartWellbeingAdviceOutputSchema>;

export async function getSmartWellbeingAdvice(input: SmartWellbeingAdviceInput): Promise<SmartWellbeingAdviceOutput> {
  return getSmartWellbeingAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartWellbeingAdvicePrompt',
  input: {schema: SmartWellbeingAdviceInputSchema},
  output: {schema: SmartWellbeingAdviceOutputSchema},
  prompt: `You are a helpful AI assistant that provides smart, contextual wellbeing advice based on a patient's profile and respiration data. You will provide tips for breathing exercises and stress reduction.

Patient Profile:
Age: {{{age}}}
Gender: {{{gender}}}
Weight: {{{weight}}} kg
Past Disease: {{{pastDisease}}}
Activity Level: {{{activityLevel}}}
Body Posture: {{{bodyPosture}}}
Stress Level: {{{stressLevel}}}
Hydration Status: {{{hydrationStatus}}}
Respiration Rate: {{{respirationRate}}} breaths per minute

Provide specific and actionable advice tailored to the patient's profile, focusing on breathing exercises and stress reduction techniques. The advice should be general and NOT be interpreted as a medical diagnosis.

Advice:`,
});

const getSmartWellbeingAdviceFlow = ai.defineFlow(
  {
    name: 'getSmartWellbeingAdviceFlow',
    inputSchema: SmartWellbeingAdviceInputSchema,
    outputSchema: SmartWellbeingAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
