import SyllabusCompressor from '@/app/components/syllabus-compressor';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 text-center lg:text-left">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            SyllabusAce
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto lg:mx-0">
            Compress your syllabus into a prioritized study plan with AI. Let's ace those exams!
          </p>
        </header>
        <SyllabusCompressor />
      </div>
    </main>
  );
}
