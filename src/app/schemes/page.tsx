import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PublicSchemeList } from "@/components/public-scheme-list";
import type { Scheme } from "@/components/public-scheme-list";

// This is now a Server Component that fetches data
export default async function PublicSchemesPage() {
  // Fetch schemes directly from Firestore on the server
  const schemesCollection = collection(db, 'schemes');
  const q = query(schemesCollection, orderBy("amount"));
  const querySnapshot = await getDocs(q);

  const schemes: Scheme[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
    const amount = data.amount || 0;
    const durationMonths = data.durationMonths || 15;
    const membersPerGroup = data.membersPerGroup || 15;

    return {
      id: doc.id,
      amount: amount.toLocaleString('en-IN'),
      title: data.title || 'Untitled Plan',
      monthly: (amount / durationMonths).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      duration: `${durationMonths} Months`,
      members: membersPerGroup,
      badge: data.badge || undefined
    };
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Our Chit Fund Schemes</h1>
        <p className="text-muted-foreground mt-2">
          Welcome! We're glad you're here. Explore our transparent and rewarding schemes.
        </p>
      </div>

      {/* Pass the server-fetched data to the new Client Component */}
      <PublicSchemeList schemes={schemes} />
      
    </div>
  );
}
