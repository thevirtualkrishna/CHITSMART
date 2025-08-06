'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HandCoins, LayoutDashboard, Users, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/auth-provider';

function AdminSidebar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
     <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <HandCoins className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline">ChitSmart</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/dashboard" tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/customers" tooltip="Customers">
                <Users />
                <span>Customer Contacts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/schemes" tooltip="Schemes">
                <Package />
                <span>Active Schemes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
             <Avatar>
              <AvatarImage src={user?.photoURL ?? "https://placehold.co/40x40"} />
              <AvatarFallback>{user?.displayName?.charAt(0) ?? 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm truncate">{user?.displayName ?? 'Admin User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email ?? 'admin@chitsmart.com'}</p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={handleLogout}>
                <LogOut />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Admin Portal</h1>
          </header>
          <main className="p-4 md:p-6 lg:p-8">
           {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}