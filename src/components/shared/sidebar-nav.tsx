
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar, // Import useSidebar
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SidebarNav() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar(); // Get context values

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false); // Close sidebar on mobile after click
    }
  };

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
                    pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard" && item.href.length > 1 && pathname.startsWith(item.href + '/'))
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground' // Removed font-semibold and hover for active
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                  tooltip={item.title}
                  onClick={handleLinkClick} // Add onClick handler
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
