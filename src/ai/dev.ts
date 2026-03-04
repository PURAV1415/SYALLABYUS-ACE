import { config } from 'dotenv';
config({ path: '.env.local' });

import '@/ai/flows/generate-syllabus-tiers-flow.ts';
