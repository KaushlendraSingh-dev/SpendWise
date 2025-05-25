
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: LucideIcon;
  imageUrl?: string;
  imageHint?: string;
}

export function PageHeader({ title, description, actions, icon: Icon, imageUrl, imageHint }: PageHeaderProps) {
  return (
    <div className={cn(
      "mb-6 flex flex-col gap-4 overflow-hidden rounded-lg border bg-card shadow-lg sm:flex-row",
      "group hover:border-accent transition-all duration-300 ease-in-out"
    )}>
      <div className="flex-1 p-6">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-8 w-8 text-primary" />}
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
        </div>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
      {/* Image container: now always block, with specific height for xs screens, and responsive widths for sm+ */}
      <div className="relative block w-full h-32 sm:h-auto sm:w-1/3 md:w-1/4 lg:w-1/5">
        <Image
          src={imageUrl || `https://placehold.co/300x200.png`}
          alt={imageUrl ? `${title} icon` : `${title} header image`}
          fill
          className={cn(
            "object-contain transition-all duration-300 ease-in-out",
            "group-hover:rotate-[-3deg] group-hover:scale-105"
          )}
          data-ai-hint={imageHint || (imageUrl ? "icon" : "abstract background")}
          priority={true}
        />
      </div>
      {actions && <div className="shrink-0 p-6 pt-0 sm:pt-6 sm:pl-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}
