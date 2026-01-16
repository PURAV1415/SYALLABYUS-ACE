'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import type { GenerateSyllabusTiersOutput } from '@/ai/flows/generate-syllabus-tiers-flow';
import ResultsDisplay from './results-display';
import Hero from './hero';

interface ResultsPanelProps {
  result: GenerateSyllabusTiersOutput | null;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-headline text-xl text-primary">Analyzing your syllabus...</p>
        <p className="text-muted-foreground">This may take a moment. The AI is hard at work!</p>
      </div>
    );
  }

  if (result) {
    return <ResultsDisplay result={result} />;
  }

  return <Hero />;
}
