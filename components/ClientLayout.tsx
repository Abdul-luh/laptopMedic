// components/ClientLayout.tsx
"use client";

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import AdminHeader from '@/components/AdminHeader';
import LoadingSpinner from "@/components/LoadingSpinner"

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while auth is initializing
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Define route patterns
  const isAuthPage = pathname?.startsWith('/login') || 
                     pathname?.startsWith('/register') || 
                     pathname?.startsWith('/forgot-password');
  
  const isPublicPage = pathname === '/' || 
                       pathname?.startsWith('/about') || 
                       pathname?.startsWith('/contact');
  
  const isDashboardPage = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/diagnose') || 
                          pathname?.startsWith('/history') || 
                          pathname?.startsWith('/profile');
  
  const isAdminPage = pathname?.startsWith('/admin');
  
  const isEngineerPage = pathname?.startsWith('/engineer');

  // Render different headers based on the current page
  const renderHeader = () => {
    if (isAuthPage) {
      // No header for auth pages
      return null;
    }
    
    if (isPublicPage && !isAuthenticated) {
      // Public header for non-authenticated users
      return <PageHeader />;
    }
    
    if (isAuthenticated) {
      if (isAdminPage && user?.role === 'admin') {
        return <AdminHeader user={user} />;
      }
      
      if (isEngineerPage && (user?.role === 'engineer' || user?.role === 'admin')) {
        return <AdminHeader user={user} />; // You can create separate EngineerHeader if needed
      }
      
      if (isDashboardPage || isPublicPage) {
        return <DashboardHeader user={user!} />;
      }
    }
    
    // Fallback to public header
    return <PageHeader />;
  };

  return (
    <>
      {renderHeader()}
      <main className={isAuthPage ? '' : 'min-h-screen'}>
        {children}
      </main>
    </>
  );
}