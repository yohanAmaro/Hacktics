'use client';

import React from 'react';
import { Badge } from './ui/Badge';

interface Request {
  id: string;
  format_id?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  formats?: {
    name: string;
  };
}

interface RequestTableProps {
  requests: Request[];
  loading?: boolean;
  onRowClick?: (id: string) => void;
}

export function RequestTable({
  requests,
  loading,
  onRowClick,
}: RequestTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay solicitudes</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Formato
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              onClick={() => onRowClick?.(request.id)}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 text-sm text-gray-900">
                {request.id.substring(0, 8)}...
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {request.formats?.name || 'Sin formato'}
              </td>
              <td className="px-4 py-3">
                <Badge status={request.status} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(request.created_at).toLocaleDateString('es-MX')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
