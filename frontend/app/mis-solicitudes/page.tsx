'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { useRequests } from '@/hooks/useApi';
import { RequestTable } from '@/components/RequestTable';
import { useState } from 'react';

export default function MisSolicitudes() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { requests, loading } = useRequests({
    ...(statusFilter && { status: statusFilter }),
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statuses = [
    { value: '', label: 'Todos' },
    { value: 'draft', label: 'Borradores' },
    { value: 'in_review', label: 'En Revisión' },
    { value: 'approved', label: 'Aprobadas' },
    { value: 'rejected', label: 'Rechazadas' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Solicitudes</h1>
          <p className="text-gray-600 mt-2">
            Aquí puedes ver y gestionar todas tus solicitudes
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <h3 className="font-medium text-gray-900 mb-3">Filtrar por estado</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              {requests.length} solicitud{requests.length !== 1 ? 'es' : ''}
            </h2>
          </div>
          <div className="p-6">
            <RequestTable
              requests={requests}
              loading={loading}
              onRowClick={(id) => router.push(`/solicitud/${id}`)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
