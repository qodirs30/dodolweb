'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/services/auth/AuthContext';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show admin sidebar/topbar if we are on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: Briefcase },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  const getBreadcrumbLabel = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname === '/admin/projects') return 'Projects';
    if (pathname?.startsWith('/admin/projects/')) return 'Project Detail';
    return 'Admin';
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
        {/* Mobile Header (visible only on small screens) */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200/60 dark:border-zinc-800/60 px-4 flex items-center justify-between z-30">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-bold text-xs">
              Ω
            </div>
            <span className="font-bold tracking-tight text-sm text-zinc-900 dark:text-zinc-50">
              AgencyEngine
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-300"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Sidebar for Desktop / Mobile Drawer Overlay */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 bg-white dark:bg-zinc-900 border-r border-zinc-200/60 dark:border-zinc-850/60 flex flex-col transition-all duration-300',
            // Responsive logic
            collapsed ? 'w-16' : 'w-60',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            'lg:static'
          )}
        >
          {/* Sidebar Brand Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-100 dark:border-zinc-850/50">
            <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-lg bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-bold text-sm shrink-0">
                Ω
              </div>
              {!collapsed && (
                <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate transition-all duration-300 text-sm">
                  AgencyEngine
                </span>
              )}
            </Link>

            {/* Collapse toggle (Desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer (Admin profile / Logout) */}
          <div className="p-3 border-t border-zinc-100 dark:border-zinc-850/50 flex flex-col gap-2">
            {!collapsed && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100/50 dark:border-zinc-800/50">
                <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate leading-none">
                    Admin Manager
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left w-full'
              )}
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Backdrop Overlay */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-xs z-30"
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 lg:pt-0">
          {/* Top Bar for Desktop */}
          <header className="hidden lg:flex h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200/50 dark:border-zinc-850/50 items-center justify-between px-8 shrink-0 z-20">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
              <span>Admin</span>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-bold">
                {getBreadcrumbLabel()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground font-medium">
                Workspace
              </span>
              <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200/30">
                <User className="h-4 w-4 text-zinc-500" />
              </div>
            </div>
          </header>

          {/* Sub-page Router Outlet */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="container mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
