'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { useRequest, useRequestApprovals } from '@/hooks/useApi';
import { RequestDetail } from '@/components/RequestDetail';
import { ApprovalTimeline } from '@/components/ApprovalTimeline';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

export default function DetalleSolicitud() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const { request = { id: '', status: '', created_at: '', updated_at: '' }, loading: requestLoading } = useRequest(requestId);
  const { approvals = [], loading: approvalsLoading } = useRequestApprovals(requestId);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleGeneratePDF = async () => {
    setGeneratingPdf(true);
    try {
      const response = await api.post(`/requests/${requestId}/documents`, {});
      if (response.success && (response as any).data?.pdf_url) {
        setPdfUrl((response as any).data.pdf_url);
        alert('PDF generado exitosamente');
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert('Error al generar PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (authLoading || !user || requestLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Solicitud no encontrada</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Volver atrás
        </button>

        {/* Encabezado */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {request.formats?.name}
              </h1>
              <p className="text-gray-600">ID: {request.id}</p>
            </div>
            <Badge status={request.status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <p className="font-medium text-gray-900 capitalize">
                {request.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de creación</p>
              <p className="font-medium text-gray-900">
                {new Date(request.created_at).toLocaleDateString('es-MX')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Última actualización</p>
              <p className="font-medium text-gray-900">
                {new Date(request.updated_at).toLocaleDateString('es-MX')}
              </p>
            </div>
            <div>
              <Button
                onClick={handleGeneratePDF}
                disabled={generatingPdf}
                size="sm"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {generatingPdf ? 'Generando...' : 'PDF'}
              </Button>
            </div>
          </div>

          {pdfUrl && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 font-medium hover:underline"
              >
                ↓ Descargar PDF generado
              </a>
            </div>
          )}
        </div>

        {/* Datos capturados */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Datos Capturados
          </h2>
          <RequestDetail data={request.data} schema={request.formats?.schema} />
        </div>

        {/* Timeline de aprobaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Flujo de Aprobación
          </h2>
          <ApprovalTimeline approvals={approvals} loading={approvalsLoading} />
        </div>
      </main>
    </div>
  );
}
