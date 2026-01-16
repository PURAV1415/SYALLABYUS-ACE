'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {firebaseApp} from '@/lib/firebase/client';
import {firebaseConfig} from '@/lib/firebase/config';
import Link from 'next/link';
import {useToast} from '@/hooks/use-toast';
import {Loader2} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
      toast({
        variant: 'destructive',
        title: 'Firebase Not Configured',
        description:
          'Please add your Firebase project configuration to src/lib/firebase/config.ts before signing in.',
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    const auth = getAuth(firebaseApp);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Session creation failed.');
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: error.message || 'An unknown error occurred.',
      });
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
