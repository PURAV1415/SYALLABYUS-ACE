'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate tiered study lists from a syllabus.
 *
 * The flow takes syllabus details (text or file upload), exam type, and available study time as input.
 * It uses the Gemini model to analyze the syllabus and prioritize topics into tiered study levels (Tier 1, Tier 2, Tier 3).
 * The output is a JSON object with tiered topics, recommendations, risk analysis, and quick revision notes.
 *
 * @interface GenerateSyllabusTiersInput - Defines the input schema for the generateSyllabusTiers function.
 * @interface GenerateSyllabusTiersOutput - Defines the output schema for the generateSyllabusTiers function.
 * @function generateSyllabusTiers - The main function that triggers the flow and returns the tiered study lists.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSyllabusTiersInputSchema = z.object({
  exam_type: z.enum(['Internal', 'Semester']).describe('The type of exam.'),
  time_value: z.number().describe('The available study time.'),
  time_unit: z.enum(['hours', 'days']).describe('The unit of time for study.'),
  syllabus_text: z.string().optional().describe('The syllabus content as text.'),
  file: z.string().optional().describe("The syllabus content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
}).refine(data => !!data.syllabus_text || !!data.file, {
  message: 'At least one of syllabus_text or file is required.',
});

export type GenerateSyllabusTiersInput = z.infer<typeof GenerateSyllabusTiersInputSchema>;

const GenerateSyllabusTiersOutputSchema = z.object({
  tier1: z.array(z.string()).describe('List of topics for Tier 1 study.'),
  tier2: z.array(z.string()).describe('List of topics for Tier 2 study.'),
  tier3: z.array(z.string()).describe('List of topics for Tier 3 study.'),
  recommendation: z.string().describe('Overall study recommendations.'),
  risk_analysis: z.object({
    overall_risk: z.string().describe('Overall risk assessment.'),
    high_risk_if_skipped: z.array(z.string()).describe('List of high-risk topics if skipped.'),
    notes: z.string().describe('Additional notes on risk analysis.'),
  }).describe('Risk analysis of the syllabus.'),
  quick_revision: z.object({
    'Tier 1': z.string().optional().describe("Quick revision notes for Tier 1 topics."),
    'Tier 2': z.string().optional().describe("Quick revision notes for Tier 2 topics."),
    'Tier 3': z.string().optional().describe("Quick revision notes for Tier 3 topics."),
  }).describe('Quick revision notes for each tier.'),
}).describe('Tiered study lists with risk analysis and recommendations.');

export type GenerateSyllabusTiersOutput = z.infer<typeof GenerateSyllabusTiersOutputSchema>;

export async function generateSyllabusTiers(input: GenerateSyllabusTiersInput): Promise<GenerateSyllabusTiersOutput> {
  return generateSyllabusTiersFlow(input);
}

const generateSyllabusTiersPrompt = ai.definePrompt({
  name: 'generateSyllabusTiersPrompt',
  input: {schema: GenerateSyllabusTiersInputSchema},
  output: {schema: GenerateSyllabusTiersOutputSchema},
  tools: [],
  prompt: `You are an AI assistant designed to help engineering students compress a large syllabus into priority-based study tiers, optimizing for exam scores under limited time.

You will receive the syllabus details, exam type, and available study time. Your task is to analyze the syllabus and prioritize topics into tiered study levels (Tier 1, Tier 2, Tier 3) based on importance, prerequisites, and exam-heavy topics.
Apply the Pareto principle (80/20 rule) to identify the most important topics.

Output a JSON object with the tiered topics, overall recommendations, risk analysis, and quick revision notes. No markdown, no explanations, no extra text.

Syllabus Text: {{syllabus_text}}
Syllabus File: {{#if file}}{{media url=file}}{{else}}No file provided{{/if}}
Exam Type: {{exam_type}}
Available Study Time: {{time_value}} {{time_unit}}
`,
});

const generateSyllabusTiersFlow = ai.defineFlow(
  {
    name: 'generateSyllabusTiersFlow',
    inputSchema: GenerateSyllabusTiersInputSchema,
    outputSchema: GenerateSyllabusTiersOutputSchema,
  },
  async input => {
    const {output} = await generateSyllabusTiersPrompt(input);
    return output!;
  }
);
