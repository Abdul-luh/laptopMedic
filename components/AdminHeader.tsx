
// components/AdminHeader.tsx
"use client";

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'engineer' | 'admin';
}

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h1 className="text-xl font-bold">
              Laptop Medic {user.role === 'admin' ? 'Admin' : 'Engineer'}
            </h1>
          </Link>

          <nav className="flex items-center space-x-4">
            {user.role === 'admin' && (
              <>
                <Link
                  href="/admin"
                  className="text-gray-300 hover:text-white font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="text-gray-300 hover:text-white font-medium"
                >
                  Users
                </Link>
                <Link
                  href="/admin/diagnostics"
                  className="text-gray-300 hover:text-white font-medium"
                >
                  Diagnostics
                </Link>
              </>
            )}
            
            {user.role === 'engineer' && (
              <>
                <Link
                  href="/engineer"
                  className="text-gray-300 hover:text-white font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/engineer/tickets"
                  className="text-gray-300 hover:text-white font-medium"
                >
                  Tickets
                </Link>
              </>
            )}
            
            {/* User dropdown */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-700">
              <span className="text-gray-300">{user.name}</span>
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-300 font-medium"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}