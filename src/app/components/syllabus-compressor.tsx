'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { compressSyllabusAction, type FormState } from '@/app/actions';
import FormFields from './form-fields';
import SubmitButton from './submit-button';
import ResultsPanel from './results-panel';

const initialState: FormState = { data: null, error: null };

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
