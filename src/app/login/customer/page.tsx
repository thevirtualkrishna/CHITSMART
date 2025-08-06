
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HandCoins } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, or } from 'firebase/firestore';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });

    return () => {
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
      }
    };
  }, []);


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!/^\d{10}$/.test(phoneNumber.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const fullNumber = `+91${phoneNumber.replace(/\s/g, '')}`;
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, fullNumber, appVerifier);
      
      setConfirmationResult(confirmation);
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `An OTP has been sent to ${fullNumber}.`,
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      let errorMessage = "Could not send OTP. Please check your number and try again.";
      if (error.code === 'auth/too-many-requests') {
        errorMessage = "You've requested too many OTPs. Please try again later.";
      } else if (error.code === 'auth/internal-error' || error.code === 'auth/captcha-check-failed') {
         errorMessage = "An internal error occurred. Please refresh and try again.";
      }
      toast({
        title: "Failed to Send OTP",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!confirmationResult) {
      toast({
          title: "Verification session expired.",
          description: "Please request a new OTP.",
          variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      if (!user.phoneNumber) {
        throw new Error("Phone number not found in user credentials.");
      }

      const customersRef = collection(db, "customers");
      const internationalNumber = user.phoneNumber; // e.g., +919876543210
      const localNumber = user.phoneNumber.substring(3); // e.g., 9876543210

      // Query for the customer using either the international or local number format.
      const q = query(customersRef, 
        or(
            where("number", "==", internationalNumber),
            where("number", "==", localNumber)
        )
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: "Welcome!",
          description: "Your number is verified, but not registered. Explore our schemes to get started.",
        });
        await signOut(auth); // Log out user if they are not a customer.
        router.push('/schemes');
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard.",
        });
        router.push('/customer/dashboard');
      }
    } catch (error: any)
    {
      console.error("Error verifying OTP or fetching customer:", error);
      let errorMessage = "An error occurred during login. Please try again.";
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = "The OTP you entered is incorrect. Please double-check and try again.";
      } else if (error.code === 'auth/code-expired') {
        errorMessage = "The OTP has expired. Please request a new one."
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* This container must exist in the DOM for the invisible reCAPTCHA to work. */}
      <div id="recaptcha-container"></div>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto mb-4">
            <HandCoins className="h-12 w-12 text-primary" />
          </Link>
          <CardTitle className="text-2xl font-headline">Customer Login</CardTitle>
          <CardDescription>
            {otpSent ? 'Enter the OTP sent to your phone.' : 'Enter your 10-digit phone number to receive an OTP.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-sm text-muted-foreground">+91</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-l-none"
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter your 6-digit OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>
              <Button variant="link" size="sm" onClick={() => { setOtpSent(false); setOtp(''); }} disabled={loading}>
                Change Number
              </Button>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            Are you an admin?{' '}
            <Link href="/login/admin" className="underline">
              Admin Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
