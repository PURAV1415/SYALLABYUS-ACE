import SyllabusCompressor from '@/app/components/syllabus-compressor';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="font-headline text-2xl font-bold text-primary">SyllabusAce</h1>
            <p className="text-sm text-muted-foreground hidden md:block">
              Your AI-powered study partner.
            </p>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <SyllabusCompressor />
      </main>
    </div>
  );
}
