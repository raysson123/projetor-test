import React from 'react';

export default function Falha() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Pagamento não realizado</h1>
      <p>
        Ocorreu um erro ou o pagamento foi cancelado.<br />
        Tente novamente ou escolha outro método.<br />
        <a href='/dashboard'>Ir para o painel</a>
      </p>
    </div>
  );
} 