import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BookOpenCheck } from 'lucide-react';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-4">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          width={400}
          height={267}
          data-ai-hint={heroImage.imageHint}
          className="rounded-lg mb-6 opacity-75 max-w-full h-auto"
          priority
        />
      )}
      <BookOpenCheck className="h-16 w-16 text-primary/50 mb-4" />
      <h2 className="font-headline text-2xl font-bold text-foreground">
        Your AI Study Partner
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Fill out the form to get your personalized, AI-powered study plan.
      </p>
    </div>
  );
}
