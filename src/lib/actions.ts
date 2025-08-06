'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Updates the number of groups for a specific scheme in Firestore.
 * This server action uses the document ID for a precise update.
 * @param schemeId - The Firestore document ID of the scheme to update.
 * @param newGroups - The new number of groups to set.
 */
export async function updateSchemeGroups(schemeId: string, newGroups: number) {
  if (!schemeId || typeof newGroups !== 'number' || newGroups < 0) {
    return { error: 'Invalid input provided.' };
  }

  try {
    const schemeRef = doc(db, 'schemes', schemeId);
    const docSnap = await getDoc(schemeRef);

    if (!docSnap.exists()) {
      return { error: `Scheme with ID ${schemeId} not found.` };
    }

    await updateDoc(schemeRef, {
      groups: newGroups
    });

    // Revalidate the path to ensure the UI updates with the new data.
    revalidatePath('/admin/schemes');

    return { success: true };
  } catch (error) {
    console.error('Error updating scheme:', error);
    return { error: 'An unexpected error occurred while updating the scheme.' };
  }
}
