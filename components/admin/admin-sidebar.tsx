'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChefHat,
  LayoutDashboard,
  UtensilsCrossed,
  FolderOpen,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';

interface AdminSidebarProps {
  locale: string;
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: t('dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/admin/recipes`,
      label: t('recipes'),
      icon: UtensilsCrossed,
    },
    {
      href: `/${locale}/admin/categories`,
      label: t('categories'),
      icon: FolderOpen,
    },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <ChefHat className="h-6 w-6 text-sidebar-primary" />
        <span className="font-serif text-lg font-bold text-sidebar-foreground">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
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

      {/* Sign Out */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {t('signOut')}
        </Button>
      </div>
    </aside>
  );
}
