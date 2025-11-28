'use client';

import React from 'react';
import { Check, Clock, X, AlertCircle } from 'lucide-react';

interface Approval {
  id: string;
  step: number;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  signed_at?: string;
  approver_id?: string;
}

interface ApprovalTimelineProps {
  approvals: Approval[];
  loading?: boolean;
}

export function ApprovalTimeline({ approvals, loading }: ApprovalTimelineProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval, index) => (
        <div key={approval.id} className="flex gap-4">
          {/* Timeline línea */}
          <div className="flex flex-col items-center">
            <div className={`rounded-full p-2 ${getStatusColor(approval.status)}`}>
              {getStatusIcon(approval.status)}
            </div>
            {index < approvals.length - 1 && (
              <div className="w-0.5 h-12 bg-gray-200 my-2"></div>
            )}
          </div>

          {/* Contenido */}
          <div className="flex-1 pb-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Paso {approval.step}: {approval.role}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Estado: <span className="font-medium capitalize">{approval.status}</span>
                  </p>
                  {approval.signed_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(approval.signed_at).toLocaleDateString('es-MX')}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                    approval.status
                  )}`}
                >
                  {approval.status === 'pending' && 'Pendiente'}
                  {approval.status === 'approved' && 'Aprobado'}
                  {approval.status === 'rejected' && 'Rechazado'}
                </span>
              </div>

              {approval.comment && (
                <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Comentario: </span>
                    {approval.comment}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'approved':
      return <Check className="w-5 h-5 text-white" />;
    case 'rejected':
      return <X className="w-5 h-5 text-white" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-white" />;
    default:
      return <AlertCircle className="w-5 h-5 text-white" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    case 'pending':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
