'use client';

import { useEffect, useRef, useActionState } from 'react';
import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/use-toast';
import { compressSyllabusAction, type FormState } from '@/app/actions';
import SubmitButton from './submit-button';
import ResultsPanel from './results-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

const initialState: FormState = { data: null, error: null };

function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-[150px] w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

const FormFields = dynamic(() => import('./form-fields'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});


export default function SyllabusCompressor() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(compressSyllabusAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const hasShownSuccessToast = useRef(false);

  const handleShare = () => {
    if (!state.data) return;
    const result = state.data;
    
    const tierTitles = {
      tier1: 'Tier 1: Top Priority',
      tier2: 'Tier 2: Secondary Focus',
      tier3: 'Tier 3: Best Effort',
    };

    let shareText = 'SyllabusAce Study Plan\n\n';

    // Tiers
    shareText += '== Study Tiers ==\n';
    (['tier1', 'tier2', 'tier3'] as const).forEach(tier => {
      const topics = result[tier] as string[];
      if (topics && topics.length > 0) {
        shareText += `\n**${tierTitles[tier]}**\n`;
        topics.forEach(topic => {
          shareText += `- ${topic}\n`;
        });
      }
    });

    // Checklist
    if (result.hourly_checklist && result.hourly_checklist.length > 0) {
      shareText += '\n== Hourly Checklist ==\n';
      result.hourly_checklist.forEach(item => {
        shareText += `${item.time_slot}: ${item.topic}\n`;
      });
    }

    // Recommendation
    shareText += `\n== Recommendation ==\n${result.recommendation}\n`;

    // Risk Analysis
    shareText += '\n== Risk Analysis ==\n';
    shareText += `Overall Risk: ${result.risk_analysis.overall_risk}\n`;
    shareText += `High Risk if Skipped: ${result.risk_analysis.high_risk_if_skipped.join(', ' )}\n`;
    shareText += `Notes: ${result.risk_analysis.notes}\n`;

    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: 'Plan Copied!',
        description: 'The study plan has been copied to your clipboard.',
      });
    }).catch(err => {
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Could not copy the plan to the clipboard.',
      });
    });
  };


  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
      hasShownSuccessToast.current = false;
    }
    if (state.data && !hasShownSuccessToast.current) {
      toast({
        title: 'Success!',
        description: 'Your study plan has been generated.',
      });
      // formRef.current?.reset(); // Commented out to prevent clearing form on re-submissions
      hasShownSuccessToast.current = true;
    }
  }, [state, toast]);

  return (
    <form action={(formData) => {
      hasShownSuccessToast.current = false;
      formAction(formData);
    }} ref={formRef}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8 rounded-xl border bg-card p-6 shadow-sm">
          <FormFields />
          <SubmitButton />
        </div>
        <div className="relative rounded-xl border-2 border-dashed bg-card/50 min-h-[60vh] lg:min-h-0">
          {state.data && (
            <div className="absolute top-4 right-4 z-10">
              <Button type="button" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          )}
          <ResultsPanel result={state.data} />
        </div>
      </div>
    </form>
  );
}
