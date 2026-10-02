import { useEffect, useRef } from "react";
import { formatarRupe, formatarValor, formatarDataHora } from "../../utilitarios/formatadores";
import "./PaginaComprovativo.css";

const TEMPO_COMPROVATIVO_MS = 10000;

export default function PaginaComprovativo({ comprovativo, aoTerminar }) {
  const aoTerminarRef = useRef(aoTerminar);
  useEffect(() => {
    aoTerminarRef.current = aoTerminar;
  });

  useEffect(() => {
    const id = setTimeout(() => aoTerminarRef.current(), TEMPO_COMPROVATIVO_MS);
    return () => clearTimeout(id);
  }, []);

  const { numeroTransacao, rupe, valor, dataHora } = comprovativo;

  return (
    <div className="pagamento">
      <section className="comprovativo">
        <h1 className="comprovativo-titulo">PAGAMENTO EFECTUADO</h1>

        <div className="comprovativo-linha">
          <span>Nº da transacção</span>
          <strong>{numeroTransacao}</strong>
        </div>
        <div className="comprovativo-linha">
          <span>RUPE</span>
          <strong>{formatarRupe(rupe)}</strong>
        </div>
        <div className="comprovativo-linha">
          <span>Valor pago</span>
          <strong>{formatarValor(valor)}</strong>
        </div>
        <div className="comprovativo-linha">
          <span>Data e hora</span>
          <strong>{formatarDataHora(dataHora)}</strong>
        </div>

        <p className="comprovativo-aviso">A regressar ao início automaticamente...</p>
      </section>
    </div>
  );
}