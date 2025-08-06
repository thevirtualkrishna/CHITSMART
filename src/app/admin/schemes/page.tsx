'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users, Wallet, Calendar } from 'lucide-react';
import { EditSchemeDialog } from '@/components/edit-scheme-dialog';
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Scheme {
  id: string;
  amount: string;
  title: string;
  monthly: string;
  duration: string;
  groups: number;
  members: number;
  badge?: string;
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "schemes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const schemesData: Scheme[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        schemesData.push({
          id: doc.id,
          amount: data.amount?.toLocaleString('en-IN') || '0',
          title: data.title || 'Untitled Scheme',
          monthly: (data.amount / (data.durationMonths || 15)).toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0',
          duration: `${data.durationMonths || 15} Months`,
          groups: data.groups || 0,
          members: (data.groups || 0) * (data.membersPerGroup || 15),
          badge: data.badge || undefined,
        });
      });
      // Sort schemes by amount
      schemesData.sort((a, b) => parseInt(a.amount.replace(/,/g, '')) - parseInt(b.amount.replace(/,/g, '')));
      setSchemes(schemesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching schemes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading schemes...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Active Schemes</h1>
          <p className="text-muted-foreground">Manage your chit fund schemes and groups.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Scheme
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schemes.length > 0 ? schemes.map((scheme) => (
          <Card key={scheme.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl font-bold text-primary">{scheme.amount}-IN</CardTitle>
                {scheme.badge && <div className="text-sm font-semibold bg-primary/20 text-primary-foreground py-1 px-3 rounded-full">{scheme.badge}</div>}
              </div>
              <CardDescription className="text-lg font-semibold">{scheme.title}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{scheme.monthly}-IN</p>
                    <p className="text-muted-foreground">Monthly</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{scheme.duration}</p>
                    <p className="text-muted-foreground">Duration</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md col-span-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{scheme.groups} Groups</p>
                    <p className="text-muted-foreground">{scheme.members} Members ({scheme.members / (scheme.groups || 1)} per group)</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <EditSchemeDialog scheme={scheme} />
            </CardFooter>
          </Card>
        )) : (
          <p className="text-muted-foreground col-span-full">No schemes found in the database.</p>
        )}
      </div>
    </div>
  );
}
