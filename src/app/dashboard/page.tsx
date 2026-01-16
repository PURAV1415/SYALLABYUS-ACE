import SyllabusCompressor from '@/app/components/syllabus-compressor';

export default function DashboardPage() {
  return (
    <main className="min-h-full bg-background flex-1">
      <div className="container mx-auto px-4 py-8 md:py-12 h-full">
        <SyllabusCompressor />
      </div>
    </main>
  );
}
