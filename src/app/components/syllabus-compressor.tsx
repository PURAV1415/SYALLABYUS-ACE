'use client';

import { useEffect, useRef, useActionState } from 'react';
import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/use-toast';
import { compressSyllabusAction, type FormState } from '@/app/actions';
import SubmitButton from './submit-button';
import ResultsPanel from './results-panel';
import { Skeleton } from '@/components/ui/skeleton';

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
          <ResultsPanel result={state.data} />
        </div>
      </div>
    </form>
  );
}
