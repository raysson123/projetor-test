import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Pendente() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = '/';
    }, 10000); // 10 segundos
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Pagamento</h1>
        <p className="text-lg text-gray-700 mb-6">
          Você será direcionado para o site.<br />
          Caso tenha feito o pagamento corretamente, o seu curso já estará liberado na sua dashboard.
        </p>
        <p className="text-sm text-gray-500 mb-2">Redirecionando em 10 segundos...</p>
        <a href="/" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          Ir para a página principal agora
        </a>
      </div>
    </div>
  );
} 