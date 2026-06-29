import { useLocation } from 'react-router-dom';

export default function Cancelado() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = params.get('collection_status');

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Pagamento não realizado</h1>
      <p>
        {status === 'null' || !status
          ? 'Você cancelou ou não finalizou o pagamento.'
          : `Status do pagamento: ${status}`}
      </p>
      <a href="/">Voltar para a página inicial</a>
    </div>
  );
} 