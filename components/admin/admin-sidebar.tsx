'use client';

import { usePathname, useRouter } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChefHat,
  LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  LogOut,
  Megaphone,
  Home,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

const admin = copy.admin;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: '/admin',
      label: admin.dashboard,
      icon: LayoutDashboard,
    },
    {
      href: '/admin/pages',
      label: admin.sitePages,
      icon: FileText,
    },
    {
      href: '/admin/recipes',
      label: admin.recipes,
      icon: UtensilsCrossed,
    },
    {
      href: '/admin/categories',
      label: admin.categories,
      icon: FolderOpen,
    },
    {
      href: '/admin/ads',
      label: admin.ads.nav,
      icon: Megaphone,
    },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <ChefHat className="h-6 w-6 text-sidebar-primary" />
        <span className="font-serif text-lg font-bold text-sidebar-foreground">
          Admin
        </span>
      </div>

      <div className="border-b border-sidebar-border p-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground"
          asChild
        >
          <Link href="/">
            <Home className="h-4 w-4 shrink-0" />
            {admin.goHome}
          </Link>
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const dashboardHref = '/admin';
          const isActive =
            pathname === item.href ||
            (item.href !== dashboardHref && !!pathname?.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {admin.signOut}
        </Button>
      </div>
    </aside>
  );
}
