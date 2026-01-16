'use server';
/**
 * @fileOverview A syllabus prioritization AI agent.
 *
 * - prioritizeSyllabus - A function that handles the syllabus prioritization process.
 * - PrioritizeSyllabusInput - The input type for the prioritizeSyllabus function.
 * - PrioritizeSyllabusOutput - The return type for the prioritizeSyllabus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeSyllabusInputSchema = z.object({
  examType: z.enum(['Internal', 'Semester']).describe('The type of exam.'),
  timeValue: z.number().describe('The amount of time available for studying.'),
  timeUnit: z.enum(['hours', 'days']).describe('The unit of time available for studying.'),
  syllabusText: z.string().optional().describe('The syllabus text.'),
  fileDataUri: z.string().optional().describe(
    "A file containing the syllabus, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
}).refine(data => data.syllabusText || data.fileDataUri, 'Either syllabusText or fileDataUri must be provided.');

export type PrioritizeSyllabusInput = z.infer<typeof PrioritizeSyllabusInputSchema>;

const PrioritizeSyllabusOutputSchema = z.object({
  tier1: z.array(z.string()).describe('The most important topics to study.'),
  tier2: z.array(z.string()).describe('The important topics to study.'),
  tier3: z.array(z.string()).describe('The less important topics to study.'),
  recommendation: z.string().describe('Overall study recommendations.'),
  riskAnalysis: z.object({
    overallRisk: z.string().describe('The overall risk of not studying all the material.'),
    highRiskIfSkipped: z.array(z.string()).describe('The topics that are high risk if skipped.'),
    notes: z.string().describe('Additional notes about the risk analysis.'),
  }).describe('A risk analysis of not studying all the material.'),
  quickRevision: z.record(z.string(), z.any()).describe('Quick revision notes for each topic.'),
});

export type PrioritizeSyllabusOutput = z.infer<typeof PrioritizeSyllabusOutputSchema>;

export async function prioritizeSyllabus(input: PrioritizeSyllabusInput): Promise<PrioritizeSyllabusOutput> {
  return prioritizeSyllabusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeSyllabusPrompt',
  input: {schema: PrioritizeSyllabusInputSchema},
  output: {schema: PrioritizeSyllabusOutputSchema},
  prompt: `You are an AI expert in syllabus compression, focusing on efficient exam preparation for engineering students.

You will use the provided syllabus, exam type, and available study time to prioritize topics into three tiers: Tier 1 (most important), Tier 2 (important), and Tier 3 (less important).
Apply the Pareto principle (80/20 rule) to identify the most critical concepts for exam success. Reasoning, not summarization.
Identify prerequisites and exam-heavy topics to ensure students focus on foundational knowledge.

Output MUST be STRICT JSON ONLY. No markdown, no explanations, no extra text.

Syllabus: {{{syllabusText}}}
File: {{#if fileDataUri}}{{media url=fileDataUri}}{{/if}}
Exam Type: {{{examType}}}
Study Time: {{{timeValue}}} {{{timeUnit}}}

JSON Schema:
{
  "tier1": [],
  "tier2": [],
  "tier3": [],
  "recommendation": "",
  "risk_analysis": {
    "overall_risk": "",
    "high_risk_if_skipped": [],
    "notes": ""
  },
  "quick_revision": {}
}
`,
});

const prioritizeSyllabusFlow = ai.defineFlow(
  {
    name: 'prioritizeSyllabusFlow',
    inputSchema: PrioritizeSyllabusInputSchema,
    outputSchema: PrioritizeSyllabusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
