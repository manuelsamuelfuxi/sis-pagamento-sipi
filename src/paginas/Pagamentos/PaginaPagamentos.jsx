import { useCallback, useEffect, useRef, useState } from "react";
import { useServicos } from "../../contexto/ContextoServicos";
import { ESTADOS_RUPE, CODIGOS_ERRO_RUPE } from "../../servicos/ServicoRupes";
import "./PaginaPagamentos.css";

const TAMANHO_RUPE = 20;

const MENSAGENS_ERRO = {
  [CODIGOS_ERRO_RUPE.NAO_ENCONTRADO]: "RUPE não encontrado. Verifique o número e tente novamente.",
  [CODIGOS_ERRO_RUPE.FORMATO_INVALIDO]: "RUPE inválido. Deve ter 20 dígitos.",
};
const MENSAGENS_ESTADO = {
  [ESTADOS_RUPE.PAGO]: "Este RUPE já foi pago.",
  [ESTADOS_RUPE.EXPIRADO]: "Este RUPE está expirado.",
};

export default function PaginaPagamentos({ aoRupeValido, aoCancelar }) {
  const { rupes } = useServicos();
  const [rupe, setRupe] = useState("");
  const [aProcessar, setAProcessar] = useState(false);
  const [erro, setErro] = useState("");
  const ativo = useRef(true);
  const completo = rupe.length === TAMANHO_RUPE;

  useEffect(() => {
    ativo.current = true;
    return () => {
      ativo.current = false;
    };
  }, []);

  const confirmar = useCallback(async () => {
    if (rupe.length !== TAMANHO_RUPE || aProcessar) return;
    setAProcessar(true);
    setErro("");
    try {
      const dados = await rupes.consultar(rupe);
      if (!ativo.current) return;

      if (dados.estado !== ESTADOS_RUPE.ABERTO) {
        setErro(MENSAGENS_ESTADO[dados.estado] ?? "Este RUPE não está disponível para pagamento.");
        setRupe("");
        return;
      }
      aoRupeValido(dados);
    } catch (e) {
      if (!ativo.current) return;
      setErro(MENSAGENS_ERRO[e.codigo] ?? "Não foi possível consultar o RUPE. Tente novamente.");
      setRupe("");
    } finally {
      if (ativo.current) setAProcessar(false);
    }
  }, [rupe, aProcessar, rupes, aoRupeValido]);

  useEffect(() => {
    const aoPremir = (e) => {
      if (aProcessar) return;
      if (/^\d$/.test(e.key)) {
        if (!e.repeat) {
          setErro("");
          setRupe((r) => (r.length < TAMANHO_RUPE ? r + e.key : r));
        }
      } else if (e.key === "Backspace") {
        setRupe((r) => r.slice(0, -1));
      } else if (e.key === "Enter" && !e.repeat) {
        confirmar();
      } else if (e.key === "Escape" && !e.repeat) {
        aoCancelar();
      }
    };

    const aoColar = (e) => {
      if (aProcessar) return;
      const digitos = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, TAMANHO_RUPE);
      if (digitos) {
        setErro("");
        setRupe(digitos);
      }
    };

    window.addEventListener("keydown", aoPremir);
    window.addEventListener("paste", aoColar);
    return () => {
      window.removeEventListener("keydown", aoPremir);
      window.removeEventListener("paste", aoColar);
    };
  }, [aProcessar, confirmar, aoCancelar]);

  return (
    <div className="pagamento">
      <h1 className="pagamento-titulo">DIGITE O RUPE</h1>

      <div className="rupe-caixas" aria-label="RUPE">
        {Array.from({ length: TAMANHO_RUPE }, (_, i) => (
          <div
            key={i}
            className={`rupe-caixa ${i < rupe.length ? "preenchida" : ""} ${i === rupe.length ? "atual" : ""} ${i > 0 && i % 3 === 0 ? "inicio-grupo" : ""}`}
          >
            {rupe[i] ?? ""}
          </div>
        ))}
      </div>

      <p className={`pagamento-estado ${erro ? "erro" : ""}`} role="status">
        {aProcessar ? "A verificar..." : erro}
      </p>

      <div className="pagamento-botoes">
        <button
          type="button"
          className="botao-pag botao-ok"
          disabled={!completo || aProcessar}
          onClick={confirmar}
        >
          OK
        </button>
        <button type="button" className="botao-pag botao-cancelar" onClick={aoCancelar}>
          Cancelar
        </button>
        <button
          type="button"
          className="botao-pag botao-limpar"
          disabled={aProcessar}
          onClick={() => {
            setRupe("");
            setErro("");
          }}
        >
          Limpar
        </button>
      </div>
    </div>
  );
}