
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SidebarNav() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
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
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                  tooltip={item.title} // Pass item title for tooltip
                  onClick={handleLinkClick}
                >
                  {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                  {/* The span for the label will be handled by SidebarMenuButton styles for collapsed mode */}
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
