
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, Wallet, Calendar, ShieldCheck } from "lucide-react";
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, DocumentData, or } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

interface CustomerData {
  id: string;
  name: string;
  scheme: number;
  liftStatus: 'Lifted' | 'Running' | 'Defaulted';
  monthly: number;
  nextPayment: string;
}

export default function CustomerDashboardPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [customer, setCustomer] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
            if (user && user.phoneNumber) {
                try {
                    const customersRef = collection(db, "customers");
                    const internationalNumber = user.phoneNumber;
                    const localNumber = user.phoneNumber.substring(3);

                    // Query for the customer using either the international or local number format.
                    const q = query(customersRef, 
                        or(
                            where("number", "==", internationalNumber),
                            where("number", "==", localNumber)
                        )
                    );
                    
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const customerDoc = querySnapshot.docs[0];
                        const customerData = customerDoc.data() as DocumentData;
                        
                        setCustomer({
                            id: customerDoc.id,
                            name: customerData.name,
                            scheme: customerData.scheme,
                            liftStatus: customerData.liftStatus,
                            monthly: customerData.scheme / 15, // Note: This might need adjustment if duration changes
                            nextPayment: customerData.liftStatus === 'Running' ? '05-Sep-2024' : 'N/A', // Example logic
                        });
                    } else {
                        // This case is important: user is authenticated but not in our database.
                        toast({
                            title: 'Account Not Found',
                            description: "Your number is not registered. Please contact support or explore our schemes.",
                            variant: 'destructive',
                        });
                        // Redirecting to schemes page allows them to join one.
                        await signOut(auth);
                        router.push('/schemes');
                    }
                } catch (error) {
                     toast({
                        title: 'Error',
                        description: "An unexpected error occurred while fetching your data. Please try logging in again.",
                        variant: 'destructive',
                    });
                    await signOut(auth);
                    router.push('/login/customer');
                } finally {
                    setLoading(false);
                }
            } else if (!user) {
                // No authenticated user, redirect to login unless we are still in the initial loading phase.
                 if (!loading) {
                    router.push('/login/customer');
                }
            }
        });
        
        // On initial component mount, if there's no user after a short delay, stop loading and redirect.
        const timer = setTimeout(() => {
            if (loading) {
                const currentUser = auth.currentUser;
                if(!currentUser){
                    setLoading(false);
                    router.push('/login/customer');
                }
            }
        }, 2500);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, [router, toast, loading]);


    if (loading || !customer) {
        return <div className="flex items-center justify-center h-screen"><p>Loading your details...</p></div>;
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, {customer.name}!</h1>
        <p className="text-muted-foreground">Here is a summary of your chit fund details.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Scheme</CardTitle>
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.scheme.toLocaleString('en-IN')}-IN</div>
              <p className="text-xs text-muted-foreground">Total Value</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
              <User className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.monthly.toLocaleString('en-IN')}-IN</div>
              <p className="text-xs text-muted-foreground">Your contribution</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.nextPayment}</div>
              <p className="text-xs text-muted-foreground">Mark your calendar</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <Badge
                    variant={customer.liftStatus === 'Lifted' ? 'default' : customer.liftStatus === 'Running' ? 'secondary' : 'destructive'}
                    className={`capitalize text-lg ${customer.liftStatus === 'Lifted' ? 'bg-blue-100 text-blue-800' : customer.liftStatus === 'Running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {customer.liftStatus}
                  </Badge>
            </CardContent>
        </Card>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>A record of your recent payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* This is still static, we can connect this to a sub-collection later */}
              <TableRow>
                <TableCell>10-Jun-2024</TableCell>
                <TableCell>{customer.monthly.toLocaleString('en-IN')}-IN</TableCell>
                <TableCell className="text-right"><Badge className="bg-green-100 text-green-800">Paid</Badge></TableCell>
              </TableRow>
               <TableRow>
                <TableCell>10-May-2024</TableCell>
                <TableCell>{customer.monthly.toLocaleString('en-IN')}-IN</TableCell>
                <TableCell className="text-right"><Badge className="bg-green-100 text-green-800">Paid</Badge></TableCell>
              </TableRow>
               <TableRow>
                <TableCell>10-Apr-2024</TableCell>
                <TableCell>{customer.monthly.toLocaleString('en-IN')}-IN</TableCell>
                <TableCell className="text-right"><Badge className="bg-green-100 text-green-800">Paid</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
       </Card>

    </div>
  );
}
