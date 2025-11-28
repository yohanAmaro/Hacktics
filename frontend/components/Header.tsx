'use client';

import React, { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              ITP Trámites
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/formatos"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Formatos
              </Link>
              <Link
                href="/mis-solicitudes"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Mis Solicitudes
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-700">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : null}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Dashboard
            </Link>
            <Link
              href="/formatos"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Formatos
            </Link>
            <Link
              href="/mis-solicitudes"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Mis Solicitudes
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
