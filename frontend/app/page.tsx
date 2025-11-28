'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">ITP Puebla</h1>
          <p className="text-gray-600">Sistema de Gestión de Trámites</p>
        </div>
        
        <div className="my-8">
          <p className="text-gray-700 mb-6">
            Bienvenido al sistema digital de trámites del Instituto Tecnológico de Puebla.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Configure Supabase para activar todas las funcionalidades. Vea la guía de configuración en COMIENZA_AQUI.txt
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Ir al Login
          </Link>
          <Link
            href="/dashboard"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Ver Dashboard (Demo)
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Estado del Sistema</h3>
          <div className="space-y-2 text-left text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-700">Frontend: Funcionando ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-700">Backend API: Funcionando ✓</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-700">Base de Datos: Pendiente configuración</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
