'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HandCoins } from 'lucide-react';
import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/admin/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled the popup, so we don't need to show an error.
        console.log("Google login popup closed by user.");
        return;
      }
      console.error("Error during Google login:", error);
      toast({
        title: "Login Failed",
        description: "Could not log in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto mb-4">
            <HandCoins className="h-12 w-12 text-primary" />
          </Link>
          <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
          <CardDescription>Use your Google account to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button onClick={handleGoogleLogin} className="w-full mt-2">
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 61.2l-77.8 77.8C299.9 119.3 262.3 104 248 104c-73.8 0-134.3 60.3-134.3 134.8s60.5 134.7 134.3 134.7c86.6 0 112.5-63.6 116.3-94.8H248v-65.4h239.1c1.3 12.2 2.2 24.2 2.2 36.4z"></path></svg>
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Not an admin?{' '}
            <Link href="/login/customer" className="underline">
              Login as Customer
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
