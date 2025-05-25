
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger }from '@/components/ui/sheet';
import { Menu, Sparkles, LogOut } from 'lucide-react'; 
import { SidebarNav } from './sidebar-nav';
import { ScrollArea } from '../ui/scroll-area';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, useSidebar, SidebarTrigger } from '@/components/ui/sidebar'; 
import { CurrentTime } from './current-time';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import type { PropsWithChildren } from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

// New internal component that will consume the SidebarContext
function AppShellContent({ children }: AppShellProps) {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { openMobile, setOpenMobile, toggleSidebar } = useSidebar(); // Consuming the context

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: "Logged Out", description: "You have been successfully logged out."});
      router.replace('/login');
    } catch (error) {
      console.error("Logout failed", error);
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive"});
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]"> {/* Changed md:grid-cols for auto width */}
      <Sidebar className="border-r bg-sidebar text-sidebar-foreground" collapsible="icon"> {/* Enable icon collapsible mode */}
        <SidebarHeader className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-primary-foreground hover:text-sidebar-primary-foreground/80">
            <Sparkles className="h-7 w-7" />
            <span className="text-lg hidden group-data-[state=expanded]:inline">{siteConfig.name}</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4 lg:px-4 flex-grow">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-2 lg:p-4">
          {user && (
            <div className="text-xs text-sidebar-foreground/70 truncate mb-2 px-2 group-data-[state=expanded]:block hidden" title={user.email || ''}>
              Logged in as: {user.email}
            </div>
          )}
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            <span className="hidden group-data-[state=expanded]:inline">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Menu Toggle */}
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden" // Only visible on mobile
                onClick={toggleSidebar} 
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle mobile navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-[280px] sm:max-w-[280px] bg-sidebar text-sidebar-foreground border-sidebar-border">
              <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-primary-foreground hover:text-sidebar-primary-foreground/80">
                  <Sparkles className="h-7 w-7" />
                  <span className="text-lg">{siteConfig.name}</span>
                </Link>
              </div>
              <nav className="grid gap-2 p-4 text-lg font-medium flex-grow">
                <SidebarNav />
              </nav>
               <div className="border-t border-sidebar-border p-4">
                  {user && (
                    <div className="text-xs text-sidebar-foreground/70 truncate mb-2" title={user.email || ''}>
                      {user.email}
                    </div>
                  )}
                  <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleLogout}>
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop Sidebar Toggle Button */}
          <SidebarTrigger className="hidden md:flex" /> {/* Visible on md+ screens */}

          <div className="w-full flex-1">
            {/* Optional: Add search or other header elements here */}
          </div>
          <CurrentTime /> 
        </header>
        <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          <ScrollArea className="h-[calc(100vh-5rem)]"> 
             <div className="pr-4 pb-4">
                {children}
             </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}
