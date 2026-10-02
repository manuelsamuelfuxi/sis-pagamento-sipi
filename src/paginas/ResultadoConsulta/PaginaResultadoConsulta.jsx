import { useEffect } from "react";
import { formatarRupe, formatarValor } from "../../utilitarios/formatadores";
import "./PaginaResultadoConsulta.css";

export default function PaginaResultadoConsulta({ rupe, estado, valor, aoNovaConsulta, aoMenu }) {
  useEffect(() => {
    const aoPremir = (e) => {
      if (e.repeat) return;
      if (e.key === "Enter") aoNovaConsulta();
      else if (e.key === "Escape") aoMenu();
    };
    window.addEventListener("keydown", aoPremir);
    return () => window.removeEventListener("keydown", aoPremir);
  }, [aoNovaConsulta, aoMenu]);

  return (
    <div className="pagamento">
      <div className="validacao-dados">
        <span className="validacao-rotulo">RUPE</span>
        <span className="validacao-rupe">{formatarRupe(rupe)}</span>

        <span className="validacao-rotulo">ESTADO</span>
        <span className={`selo-estado selo-${estado}`}>{estado}</span>

        <span className="validacao-rotulo">VALOR</span>
        <span className="validacao-valor">{formatarValor(valor)}</span>
      </div>

      <div className="pagamento-botoes">
        <button type="button" className="botao-pag botao-ok" onClick={aoNovaConsulta}>
          Nova consulta
        </button>
        <button type="button" className="botao-pag botao-limpar" onClick={aoMenu}>
          Menu
        </button>
      </div>
    </div>
  );
}