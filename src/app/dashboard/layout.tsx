import UserNav from '@/app/components/user-nav';
import {getSession} from '@/lib/session';

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const session = await getSession();

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
          <UserNav user={session?.user} />
        </div>
      </header>
      {children}
    </div>
  );
}
