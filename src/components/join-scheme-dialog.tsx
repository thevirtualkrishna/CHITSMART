'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

type Scheme = {
  amount: string;
  title: string;
};

export function JoinSchemeDialog({ scheme }: { scheme: Scheme }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
            <Phone className="mr-2 h-4 w-4" /> Contact Us to Join
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join the {scheme.title}</DialogTitle>
          <DialogDescription>
            We're excited to have you on board! Please contact us to get started with the {scheme.amount}-IN scheme.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <p className="text-muted-foreground mt-2">
                Please contact us via phone, WhatsApp, or email to complete the joining process.
            </p>
            <div className="mt-4 space-y-2">
                <p><strong>Phone/WhatsApp:</strong> +91 7097774579</p>
                <p><strong>Email:</strong> saikrishnajella06@gmail.com</p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
