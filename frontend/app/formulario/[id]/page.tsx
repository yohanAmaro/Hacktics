'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { useFormats } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { FormBuilder } from '@/components/FormBuilder';
import { Button } from '@/components/ui/Button';

export default function FormularioDinamico() {
  const router = useRouter();
  const params = useParams();
  const formatId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const { formats, loading: formatsLoading } = useFormats();

  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const format = formats.find((f: any) => f.id === formatId);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSave = async (data: any) => {
    if (!user || !format) return;

    setSaving(true);
    try {
      const response = await api.post('/requests', {
        format_id: format.id,
        data,
      });

      if (response.success && response.data) {
        setFormData(response.data);
        alert('Solicitud guardada como borrador');
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert('Error al guardar la solicitud');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData?.id) {
      alert('Primero debe guardar la solicitud');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/requests/${formData.id}/submit`, {});

      if (response.success) {
        alert('Solicitud enviada exitosamente');
        router.push(`/solicitud/${formData.id}`);
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert('Error al enviar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user || formatsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!format) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Formato no encontrado</p>
            <button
              onClick={() => router.back()}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              ← Volver atrás
            </button>
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

        <div className="bg-white rounded-lg shadow p-6 md:p-8">
          <FormBuilder
            schema={format.schema}
            onSubmit={handleSave}
            loading={saving}
          />

          {formData && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Solicitud guardada como borrador (ID: {formData.id.substring(0, 8)}...)
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/solicitud/${formData.id}`)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
                >
                  Ver Solicitud
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {submitting ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
