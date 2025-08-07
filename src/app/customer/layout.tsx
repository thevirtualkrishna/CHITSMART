'use client';

import { HandCoins, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, or, DocumentData } from 'firebase/firestore';

interface CustomerData {
  name: string;
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // If we have a user, fetch their customer data from Firestore
        if (currentUser.phoneNumber) {
            const customersRef = collection(db, "customers");
            const internationalNumber = currentUser.phoneNumber;
            const localNumber = currentUser.phoneNumber.substring(3);
            const q = query(customersRef, or(where("number", "==", internationalNumber), where("number", "==", localNumber)));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0].data() as DocumentData;
                setCustomerData({ name: docData.name });
            }
        }
      } else {
        // No user is logged in. Redirect to the customer login page,
        // unless they are already on a public page.
        if (!pathname.startsWith('/login')) {
            router.push('/login/customer');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/'); // Redirect to homepage after logout
  };
  
  if (loading) {
      return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  }
  
  // If not loading and no user, we are likely redirecting, so don't render children.
  if (!user && !pathname.startsWith('/login')) {
      return null;
  }


  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href={user ? "/customer/dashboard" : "/"} className="mr-6 flex items-center space-x-2">
              <HandCoins className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block font-headline">ChitSmart</span>
            </Link>
          </div>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
             {user && (
                <>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL ?? ''} />
                            <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium hidden sm:inline">{customerData?.name ?? 'Customer'}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                        <LogOut />
                    </Button>
                </>
             )}
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
