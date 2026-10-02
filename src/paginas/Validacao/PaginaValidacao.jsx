import { useCallback, useEffect, useRef, useState } from "react";
import { useServicos } from "../../contexto/ContextoServicos";
import { CODIGOS_ERRO_RUPE } from "../../servicos/ServicoRupes";
import { formatarRupe, formatarValor } from "../../utilitarios/formatadores";
import "./PaginaValidacao.css";

const MENSAGENS_ERRO = {
  [CODIGOS_ERRO_RUPE.JA_PAGO]: "Este RUPE já foi pago.",
  [CODIGOS_ERRO_RUPE.EXPIRADO]: "Este RUPE está expirado.",
  [CODIGOS_ERRO_RUPE.NAO_ENCONTRADO]: "RUPE não encontrado.",
};

export default function PaginaValidacao({ rupe, valor, aoPago, aoCancelar }) {
  const { rupes } = useServicos();
  const [aProcessar, setAProcessar] = useState(false);
  const [erro, setErro] = useState("");
  const emCurso = useRef(false);

  const confirmar = useCallback(async () => {
    if (emCurso.current) return;
    emCurso.current = true;
    setAProcessar(true);
    setErro("");

    let comprovativo;
    try {
      comprovativo = await rupes.pagar(rupe);
    } catch (e) {
      console.error(e);
      setErro(MENSAGENS_ERRO[e.codigo] ?? "Não foi possível efectuar o pagamento. Tente novamente.");
      emCurso.current = false;
      setAProcessar(false);
      return;
    }

    aoPago(comprovativo);
  }, [rupes, rupe, aoPago]);

  const cancelar = useCallback(() => {
    if (!emCurso.current) aoCancelar();
  }, [aoCancelar]);

  useEffect(() => {
    const aoPremir = (e) => {
      if (e.repeat) return;
      if (e.key === "Enter") confirmar();
      else if (e.key === "Escape") cancelar();
    };
    window.addEventListener("keydown", aoPremir);
    return () => window.removeEventListener("keydown", aoPremir);
  }, [confirmar, cancelar]);

  return (
    <div className="pagamento">
      <div className="validacao-dados">
        <span className="validacao-rotulo">RUPE</span>
        <span className="validacao-rupe">{formatarRupe(rupe)}</span>

        <span className="validacao-rotulo">VALOR A PAGAR</span>
        <span className="validacao-valor">{formatarValor(valor)}</span>
      </div>

      <p className={`pagamento-estado ${erro ? "erro" : ""}`} role="status">
        {aProcessar ? "A processar pagamento..." : erro}
      </p>

      <div className="pagamento-botoes">
        <button type="button" className="botao-pag botao-ok" disabled={aProcessar} onClick={confirmar}>
          Confirmar
        </button>
        <button type="button" className="botao-pag botao-cancelar" disabled={aProcessar} onClick={cancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}