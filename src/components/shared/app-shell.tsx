
'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles } from 'lucide-react'; 
import { SidebarNav } from './sidebar-nav';
import { ScrollArea } from '../ui/scroll-area';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar'; 
import { CurrentTime } from './current-time';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-primary hover:text-sidebar-primary/90">
              <Sparkles className="h-7 w-7" />
              <span className="text-lg">{siteConfig.name}</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4 lg:px-4">
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0 w-[280px] sm:max-w-[280px] bg-sidebar text-sidebar-foreground border-sidebar-border">
                <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
                  <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-primary hover:text-sidebar-primary/90">
                    <Sparkles className="h-7 w-7" />
                    <span className="text-lg">{siteConfig.name}</span>
                  </Link>
                </div>
                <nav className="grid gap-2 p-4 text-lg font-medium">
                  <SidebarNav />
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* Optional: Add search or other header elements here */}
            </div>
            <CurrentTime /> 
            {/* Optional: Add user dropdown menu here */}
          </header>
          <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            <ScrollArea className="h-[calc(100vh-5rem)]"> 
               <div className="pr-4 pb-4"> {/* Add padding for scrollbar and bottom content */}
                  {children}
               </div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
