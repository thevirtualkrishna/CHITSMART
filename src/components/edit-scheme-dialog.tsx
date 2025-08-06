'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { updateSchemeGroups } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

type Scheme = {
  amount: string;
  title: string;
  groups: number;
};

export function EditSchemeDialog({ scheme }: { scheme: Scheme }) {
  const [groups, setGroups] = useState(scheme.groups);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSaveChanges = async () => {
    startTransition(async () => {
      const result = await updateSchemeGroups(scheme.amount, groups);
      if (result?.error) {
        toast({
          title: "Update Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: `The ${scheme.title} has been updated.`,
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Manage Scheme</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Scheme: {scheme.amount}-IN</DialogTitle>
          <DialogDescription>
            Modify the number of groups for the {scheme.title}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="groups" className="text-right">
              Groups
            </Label>
            <Input
              id="groups"
              type="number"
              value={groups}
              onChange={(e) => setGroups(Number(e.target.value))}
              className="col-span-3"
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveChanges} disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
