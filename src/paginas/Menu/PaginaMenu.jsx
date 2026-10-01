import { useEffect, useRef } from "react";
import "./PaginaMenu.css";

const TEMPO_LIMITE_MS = 5000;

const OPCOES = [
  { numero: "1", id: "pagamentos", rotulo: "Pagamentos" },
  { numero: "2", id: "consulta", rotulo: "Consultar" },
];

export default function PaginaMenu({ aoEscolher, aoExpirar }) {
  const aoExpirarRef = useRef(aoExpirar);
  useEffect(() => {
    aoExpirarRef.current = aoExpirar;
  });

  useEffect(() => {
    const id = setTimeout(() => aoExpirarRef.current(), TEMPO_LIMITE_MS);
    return () => clearTimeout(id);
  }, []);

  // atalhos de teclado: 1 e 2
  useEffect(() => {
    const aoPremir = (e) => {
      if (e.repeat) return;
      const opcao = OPCOES.find((o) => o.numero === e.key);
      if (opcao) aoEscolher(opcao.id);
    };
    window.addEventListener("keydown", aoPremir);
    return () => window.removeEventListener("keydown", aoPremir);
  }, [aoEscolher]);

  return (
    <div className="menu">
      <h1 className="menu-titulo">Seleccione a operação</h1>
      <div className="menu-opcoes">
        {OPCOES.map((o) => (
          <button
            key={o.id}
            type="button"
            className="menu-botao"
            aria-keyshortcuts={o.numero}
            onClick={() => aoEscolher(o.id)}
          >
            <span className="menu-numero">{o.numero}</span>
            <span>{o.rotulo}</span>
          </button>
        ))}
      </div>
    </div>
  );
}