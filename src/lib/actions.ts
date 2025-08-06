'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

interface Scheme {
  amount: string;
  title: string;
  groups: number;
}

/**
 * Updates the number of groups for a specific scheme in Firestore.
 * This is a server action that finds the relevant scheme document(s)
 * and updates the 'groups' field.
 * @param amount - The amount of the scheme to identify the document.
 * @param newGroups - The new number of groups to set.
 */
export async function updateSchemeGroups(amount: string, newGroups: number) {
  if (!amount || typeof newGroups !== 'number' || newGroups < 0) {
    return { error: 'Invalid input provided.' };
  }

  try {
    const schemesRef = collection(db, 'schemes'); 
    // Firestore stores numbers, so we need to convert the amount string to a number for the query.
    const amountNumber = parseInt(amount.replace(/,/g, ''), 10);

    if (isNaN(amountNumber)) {
      return { error: 'Invalid scheme amount format.' };
    }

    const q = query(schemesRef, where('amount', '==', amountNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // This is a fallback to add the scheme if it doesn't exist.
      // In a real production app, you might want more sophisticated logic.
      console.log(`Scheme with amount ${amountNumber} not found. Consider adding it.`);
      // For now, we will just return an error.
      return { error: `Scheme with amount ${amountNumber} not found.` };
    }

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, { groups: newGroups });
    });

    await batch.commit();

    // Revalidate the path to ensure the UI updates with the new data.
    revalidatePath('/admin/schemes');

    return { success: true };
  } catch (error) {
    console.error('Error updating scheme:', error);
    return { error: 'An unexpected error occurred while updating the scheme.' };
  }
}
