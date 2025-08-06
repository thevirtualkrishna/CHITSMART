'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      const isAdminRoute = pathname.startsWith('/admin');
      
      if (!user && isAdminRoute) {
        // If not logged in and trying to access an admin route, redirect to login
        router.push('/login/admin');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // While loading, show a loading indicator to prevent rendering children prematurely
  if (loading) {
    return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  }
  
  // If we are on an admin route and the auth state has loaded but there's no user,
  // return null to prevent rendering the children while the redirect is in progress.
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute && !user) {
    return null; 
  }

  // If we're on a login page and the user is already logged in, redirect them.
  if (user && (pathname === '/login/admin')) {
     router.push('/admin/dashboard');
     return null; // Don't render children during redirect
  }


  return (
    <AuthContext.Provider value={{ user, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
