export function IconeEscudo({ tamanho = 24 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V5l8-3z" fill="currentColor" />
      <path d="M8.5 12l2.5 2.5 4.5-5" fill="none" stroke="#0a1f4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconeCartao({ tamanho = 44 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="6" y="3" width="16" height="11" rx="2" />
      <rect x="2" y="8" width="16" height="11" rx="2" fill="#0a1f4d" />
      <path d="M2 12h16M5 16h4" />
    </svg>
  );
}

export function IconeSeta({ direcao = "esquerda", tamanho = 18 }) {
  return (
    <svg
      width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: direcao === "direita" ? "rotate(180deg)" : "none" }}
      aria-hidden="true"
    >
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function IconeApagar({ tamanho = 24 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
      <path d="M13 9l4 6M17 9l-4 6" />
    </svg>
  );
}