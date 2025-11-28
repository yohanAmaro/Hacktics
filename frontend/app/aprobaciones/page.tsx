'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { usePendingApprovals } from '@/hooks/useApi';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';
import { SignaturePad } from '@/components/SignaturePad';

export default function Aprobaciones() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { approvals = [], loading: approvalsLoading, mutate } = usePendingApprovals();

  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleApprove = async () => {
    if (!selectedApproval) return;

    setProcessing(true);
    try {
      const response = await api.post(
        `/requests/${selectedApproval.request_id}/review`,
        {
          approval_id: selectedApproval.id,
          comment,
          signature_url: signature,
        }
      );

      if (response.success) {
        alert('Solicitud aprobada exitosamente');
        setSelectedApproval(null);
        setComment('');
        setSignature(null);
        setShowSignature(false);
        mutate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert('Error al aprobar la solicitud');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApproval) return;

    if (!comment) {
      alert('Por favor ingrese un comentario explicando el rechazo');
      return;
    }

    setProcessing(true);
    try {
      const response = await api.put(
        `/requests/${selectedApproval.request_id}/review`,
        {
          approval_id: selectedApproval.id,
          comment,
        }
      );

      if (response.success) {
        alert('Solicitud rechazada');
        setSelectedApproval(null);
        setComment('');
        mutate();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert('Error al rechazar la solicitud');
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Aprobaciones Pendientes</h1>
          <p className="text-gray-600 mt-2">
            Revisa y aprueba las solicitudes asignadas a ti
          </p>
        </div>

        {approvalsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : approvals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No hay aprobaciones pendientes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de aprobaciones */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {approvals.map((approval: any) => (
                  <div
                    key={approval.id}
                    onClick={() => setSelectedApproval(approval)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedApproval?.id === approval.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <h3 className="font-medium text-gray-900">
                            {approval.requests?.formats?.name || 'Sin formato'}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Paso {approval.step} - {approval.role}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {approval.request_id.substring(0, 8)}...
                        </p>
                      </div>
                      <Badge status="pending" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel de revisión */}
            {selectedApproval && (
              <div className="bg-white rounded-lg shadow p-6 h-fit lg:sticky lg:top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Revisar Solicitud
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Paso</p>
                    <p className="font-medium text-gray-900">
                      {selectedApproval.step} - {selectedApproval.role}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentario (requerido para rechazo)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Ingrese comentario..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      rows={4}
                    />
                  </div>

                  {!showSignature ? (
                    <button
                      onClick={() => setShowSignature(true)}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                      + Agregar firma digital
                    </button>
                  ) : (
                    <SignaturePad
                      onSave={(sig) => {
                        setSignature(sig);
                        setShowSignature(false);
                      }}
                      onCancel={() => setShowSignature(false)}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {processing ? 'Procesando...' : 'Aprobar'}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={processing || !comment}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    <XCircle className="w-5 h-5" />
                    {processing ? 'Procesando...' : 'Rechazar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
