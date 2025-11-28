'use client';

import React from 'react';

interface BadgeProps {
  status?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

export function Badge({ status, children, variant = 'default' }: BadgeProps) {
  const statusMap: Record<string, { bg: string; text: string; label: string }> =
    {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Borrador' },
      submitted: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Enviado',
      },
      in_review: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'En Revisión',
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Aprobado',
      },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazado' },
      cancelled: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Cancelado',
      },
    };

  const variantMap: Record<string, { bg: string; text: string }> = {
    default: { bg: 'bg-gray-100', text: 'text-gray-800' },
    success: { bg: 'bg-green-100', text: 'text-green-800' },
    error: { bg: 'bg-red-100', text: 'text-red-800' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  };

  const config = status ? statusMap[status] : variantMap[variant];

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}
    >
      {status ? statusMap[status]?.label : children}
    </span>
  );
}
