import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Sucesso = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const productId = searchParams.get('product_id');
  const productType = searchParams.get('product_type') || 'course';
  const [aguardando, setAguardando] = useState(false);

  useEffect(() => {
    if (!profile || !productId) return;
    setAguardando(true);
    const interval = setInterval(async () => {
      const response = await fetch('/api/verifica-compra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: profile.id, product_id: productId })
      });
      const result = await response.json();
      if (result.liberado) {
        setAguardando(false);
        clearInterval(interval);
        // Redireciona automaticamente para o conteúdo correto
        navigate(productType === 'ebook' ? `/ebook/${productId}` : `/curso/${productId}`);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [profile, productId, productType, navigate]);

  // Função para redirecionar manualmente
  const handleAcessar = () => {
    if (!productId) return;
    navigate(productType === 'ebook' ? `/ebook/${productId}` : `/curso/${productId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">Pagamento aprovado!</h1>
        {aguardando && (
          <p className="text-lg text-green-800 mb-6">
            Seu pagamento está sendo processado.<br />
            Assim que for aprovado, você será redirecionado automaticamente.<br />
            <span className="text-sm text-gray-500">(Isso pode levar alguns segundos após o Pix)</span>
          </p>
        )}
        <button
          onClick={handleAcessar}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {productType === 'ebook' ? 'Acessar meu eBook' : 'Acessar meu curso'}
        </button>
      </div>
    </div>
  );
};

export default Sucesso; 