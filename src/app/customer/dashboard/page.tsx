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
                setLoading(true);
                try {
                    const customersRef = collection(db, "customers");
                    const q = query(customersRef, where("number", "==", user.phoneNumber.substring(3))); // Search by local number
                    
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const customerDoc = querySnapshot.docs[0];
                        const customerData = customerDoc.data() as DocumentData;
                        
                        setCustomer({
                            id: customerDoc.id,
                            name: customerData.name,
                            scheme: customerData.scheme,
                            liftStatus: customerData.liftStatus,
                            monthly: customerData.scheme / (customerData.durationMonths || 15),
                            nextPayment: '05-Sep-2024', // Example static date
                        });
                    } else {
                        toast({
                            title: 'Account Not Registered',
                            description: "Your phone number is verified, but you aren't registered for any schemes.",
                            variant: 'destructive',
                        });
                        await signOut(auth);
                        router.push('/schemes');
                    }
                } catch (error) {
                     toast({
                        title: 'Error Fetching Data',
                        description: "Could not retrieve your details. Please try again.",
                        variant: 'destructive',
                    });
                    await signOut(auth);
                    router.push('/login/customer');
                } finally {
                    setLoading(false);
                }
            } else if (!user) {
                // If the onAuthStateChanged callback fires with no user,
                // it means they are logged out. Redirect them.
                router.push('/login/customer');
            }
        });
        
        return () => unsubscribe();
    }, [router, toast]);


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
                    className="capitalize text-lg"
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
                <TableCell className="text-right"><Badge variant="secondary">Paid</Badge></TableCell>
              </TableRow>
               <TableRow>
                <TableCell>10-May-2024</TableCell>
                <TableCell>{customer.monthly.toLocaleString('en-IN')}-IN</TableCell>
                <TableCell className="text-right"><Badge variant="secondary">Paid</Badge></TableCell>
              </TableRow>
               <TableRow>
                <TableCell>10-Apr-2024</TableCell>
                <TableCell>{customer.monthly.toLocaleString('en-IN')}-IN</TableCell>
                <TableCell className="text-right"><Badge variant="secondary">Paid</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
       </Card>

    </div>
  );
}
