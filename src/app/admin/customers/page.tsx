'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

// Define the type for a customer document
interface Customer {
  id: string; // The Firestore document ID
  name: string;
  number: string; // The primary key for the business logic
  scheme: number; 
  disbursedDate: string;
  liftStatus: 'Lifted' | 'Running' | 'Defaulted';
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "customers"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData: Customer[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Robust validation to prevent crashes
        if (data && typeof data.name === 'string' && typeof data.number === 'string' && typeof data.scheme === 'number') {
            customersData.push({ id: doc.id, ...data } as Customer);
        } else {
            console.warn("Document with ID", doc.id, "is missing required fields or has incorrect data types. Skipping.", data);
        }
      });
      
      setCustomers(customersData);
      
      if (querySnapshot.empty) {
          setError("No customers found in your Firestore 'customers' collection.");
      } else {
          setError(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching customers from Firestore: ", err);
      setError("Failed to fetch customers. This might be due to Firestore security rules or a network issue. Check the browser console for details.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading customers...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Customer Contacts</h1>
        <p className="text-muted-foreground">View, search, and manage your customers.</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Customers</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." className="pl-10 w-full md:w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {error && !loading && customers.length === 0 && <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded-md border border-yellow-200">{error}</div>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Scheme</TableHead>
                  <TableHead>Disbursed Date</TableHead>
                  <TableHead className="text-center">Lift Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.number}</TableCell>
                      <TableCell>{customer.scheme.toLocaleString('en-IN')}-IN</TableCell>
                      <TableCell>{customer.disbursedDate || 'N/A'}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={customer.liftStatus === 'Lifted' ? 'default' : customer.liftStatus === 'Running' ? 'secondary' : 'destructive'}
                          className="capitalize"
                        >
                          {customer.liftStatus || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Remove Customer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No customer data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
