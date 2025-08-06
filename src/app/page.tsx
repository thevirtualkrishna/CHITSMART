import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HandCoins, User } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 relative overflow-hidden">
       <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(hsl(var(--primary)) 1px, transparent 1px), radial-gradient(hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />
      <div className="z-10 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <HandCoins className="h-16 w-16 text-primary" />
          <h1 className="text-6xl font-bold font-headline text-foreground">
            ChitSmart
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-12">
          Your Trusted Partner in Digital ChitFund Management
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <User className="h-8 w-8 text-primary"/>
                Admin Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">Manage schemes, members, and collections.</p>
              <Link href="/login/admin" className="w-full">
                <Button size="lg" className="w-full text-lg py-6">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <User className="h-8 w-8 text-primary"/>
                Customer Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">View your chit details and payment history.</p>
              <Link href="/login/customer" className="w-full">
                <Button size="lg" className="w-full text-lg py-6">
                  Customer Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
