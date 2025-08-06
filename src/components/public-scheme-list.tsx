'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, Calendar } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JoinSchemeDialog } from "@/components/join-scheme-dialog";

export interface Scheme {
  id: string;
  amount: string;
  title: string;
  monthly: string;
  duration: string;
  members: number;
  badge?: string;
}

interface PublicSchemeListProps {
  schemes: Scheme[];
}

// This is the new Client Component responsible for rendering the list
export function PublicSchemeList({ schemes }: PublicSchemeListProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="flex flex-col hover:shadow-lg transition-shadow">
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
                    <p className="font-semibold">{scheme.members} Members per Group</p>
                    <p className="text-muted-foreground">Join a community of savers</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
                <JoinSchemeDialog scheme={scheme} />
            </CardFooter>
          </Card>
        ))}
      </div>
       <div className="text-center mt-4">
          <p className="text-muted-foreground">Already a member?</p>
          <Button variant="link" asChild>
            <Link href="/login/customer">Login Here</Link>
          </Button>
        </div>
    </>
  );
}
