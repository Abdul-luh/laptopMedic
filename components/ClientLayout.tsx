// components/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/Header"; // Changed from PageHeader to Header
import LoadingSpinner from "@/components/LoadingSpinner";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const { isLoading } = useAuth();

  // Show loading spinner while auth is initializing

  // Define route patterns
  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password");

  // const isDashboardPage = pathname?.startsWith('/dashboard') ||
  //                         pathname?.startsWith('/diagnose') ||
  //                         pathname?.startsWith('/history') ||
  //                         pathname?.startsWith('/profile');

  if (isLoading && !isAuthPage) {
    return <LoadingSpinner />;
  }
  // const isAdminPage = pathname?.startsWith('/admin');

  // const isEngineerPage = pathname?.startsWith('/engineer');

  // Render different headers based on the current page
  const renderHeader = () => {
    if (isAuthPage) return null;

    return <PageHeader />;
  };

  return (
    <>
      {renderHeader()}
      <main
        className={
          pathname?.startsWith("/login") ||
          pathname?.startsWith("/register") ||
          pathname?.startsWith("/forgot-password")
            ? ""
            : "min-h-screen"
        }
      >
        {children}
      </main>
    </>
  );
}
