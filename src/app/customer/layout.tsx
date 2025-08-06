import { HandCoins, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/customer/dashboard" className="mr-6 flex items-center space-x-2">
              <HandCoins className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block font-headline">ChitSmart</span>
            </Link>
          </div>
          
          <div className="flex flex-1 items-center justify-end space-x-2">
             <Avatar>
                <AvatarImage src="https://placehold.co/40x40" />
                <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" asChild>
              <a href="/"><LogOut /></a>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-muted">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by ChitSmart. The source code is available on GitHub.
            </p>
        </div>
     </footer>
    </div>
  );
}
