import { useEffect } from "react";
import "./PaginaValidacao.css";

const formatarRupe = (rupe) => rupe.replace(/(\d{3})(?=\d)/g, "$1 ");

const formatarValor = (valor) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(valor);

export default function PaginaValidacao({ rupe, valor, aoConfirmar, aoCancelar }) {
  useEffect(() => {
    const aoPremir = (e) => {
      if (e.repeat) return;
      if (e.key === "Enter") aoConfirmar();
      else if (e.key === "Escape") aoCancelar();
    };
    window.addEventListener("keydown", aoPremir);
    return () => window.removeEventListener("keydown", aoPremir);
  }, [aoConfirmar, aoCancelar]);

  return (
    <div className="pagamento">
      <div className="validacao-dados">
        <span className="validacao-rotulo">RUPE</span>
        <span className="validacao-rupe">{formatarRupe(rupe)}</span>

        <span className="validacao-rotulo">VALOR A PAGAR</span>
        <span className="validacao-valor">{formatarValor(valor)}</span>
      </div>

      <div className="pagamento-botoes">
        <button type="button" className="botao-pag botao-ok" onClick={aoConfirmar}>
          Confirmar
        </button>
        <button type="button" className="botao-pag botao-cancelar" onClick={aoCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}