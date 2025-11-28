'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { useRequests, useFormats } from '@/hooks/useApi';
import { RequestTable } from '@/components/RequestTable';
import Link from 'next/link';
import { FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { requests, loading: requestsLoading } = useRequests();
  useFormats();

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

  const stats = {
    total: requests.length,
    draft: requests.filter((r: any) => r.status === 'draft').length,
    inReview: requests.filter((r: any) => r.status === 'in_review').length,
    approved: requests.filter((r: any) => r.status === 'approved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user.email?.split('@')[0]}
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus solicitudes y trámites desde aquí
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FileText}
            label="Total Solicitudes"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Borradores"
            value={stats.draft}
            color="yellow"
          />
          <StatCard
            icon={AlertCircle}
            label="En Revisión"
            value={stats.inReview}
            color="orange"
          />
          <StatCard
            icon={CheckCircle}
            label="Aprobadas"
            value={stats.approved}
            color="green"
          />
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/formatos"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Iniciar nuevo trámite
            </Link>
            <Link
              href="/aprobaciones"
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Ver aprobaciones
            </Link>
          </div>
        </div>

        {/* Solicitudes recientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Solicitudes Recientes
            </h2>
          </div>
          <div className="p-6">
            <RequestTable
              requests={requests.slice(0, 5)}
              loading={requestsLoading}
              onRowClick={(id) => router.push(`/solicitud/${id}`)}
            />
          </div>
          {requests.length > 5 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Link
                href="/mis-solicitudes"
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Ver todas las solicitudes →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorMap[color]} mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
