'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'; // Assuming Sidebar components are structured like this
import { ScrollArea } from '@/components/ui/scroll-area';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <ScrollArea className="flex-1">
      <SidebarMenu>
        {siteConfig.mainNav.map((item) =>
          item.href ? (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  variant="ghost"
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard")
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-semibold'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                  tooltip={item.title}
                >
                  {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ) : null
        )}
      </SidebarMenu>
    </ScrollArea>
  );
}
