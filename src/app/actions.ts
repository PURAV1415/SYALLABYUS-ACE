
'use server';

import { z } from 'zod';
import { generateSyllabusTiers, type GenerateSyllabusTiersOutput } from '@/ai/flows/generate-syllabus-tiers-flow';

const formSchema = z.object({
  exam_type: z.enum(['Internal', 'Semester']),
  time_value: z.coerce.number().min(1, 'Time must be at least 1.'),
  time_unit: z.enum(['hours', 'days']),
  syllabus_text: z.string().optional(),
  file: z.instanceof(File).optional().refine(file => !file || file.size < 5 * 1024 * 1024, 'File size must be less than 5MB.'),
}).refine(data => !!data.syllabus_text || (data.file && data.file.size > 0), {
  message: 'Please provide syllabus text or upload a file.',
  path: ['syllabus_text'], 
});

export type FormState = {
  data: GenerateSyllabusTiersOutput | null;
  error: string | null;
}

async function fileToDataUri(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function compressSyllabusAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    exam_type: formData.get('exam_type'),
    time_value: formData.get('time_value'),
    time_unit: formData.get('time_unit'),
    syllabus_text: formData.get('syllabus_text'),
    file: formData.get('file'),
  };
  
  const validatedFields = formSchema.safeParse(rawFormData);
  
  if (!validatedFields.success) {
      const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
      return { data: null, error: firstError || 'Invalid form data.' };
  }

  const { syllabus_text, file, ...rest } = validatedFields.data;

  try {
    const aiInput = {
      ...rest,
      syllabus_text: syllabus_text || undefined,
      file: file && file.size > 0 ? await fileToDataUri(file) : undefined,
    };

    const result = await generateSyllabusTiers(aiInput);

    if (!result) {
        return { data: null, error: 'The AI failed to generate a response. Please try again.' };
    }

    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `An unexpected error occurred: ${errorMessage}` };
  }
}
