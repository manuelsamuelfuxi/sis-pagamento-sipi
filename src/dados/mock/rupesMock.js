export const ESTADOS_RUPE = {
  ABERTO: "aberto",
  PAGO: "pago",
  EXPIRADO: "expirado",
};

// Dados provisórios: mais tarde vêm da API.
// rupe: string de 20 dígitos | valor: número em Kwanzas (AOA)
export const RUPES_MOCK = [
  { rupe: "20260100000000000001", estado: ESTADOS_RUPE.ABERTO,   valor: 15000 },
  { rupe: "20260100000000000002", estado: ESTADOS_RUPE.ABERTO,   valor: 2500 },
  { rupe: "20260100000000000003", estado: ESTADOS_RUPE.ABERTO,   valor: 48000 },
  { rupe: "20250900000000000004", estado: ESTADOS_RUPE.PAGO,     valor: 7500 },
  { rupe: "20250900000000000005", estado: ESTADOS_RUPE.PAGO,     valor: 20000 },
  { rupe: "20240100000000000006", estado: ESTADOS_RUPE.EXPIRADO, valor: 3000 },
  { rupe: "20240100000000000007", estado: ESTADOS_RUPE.EXPIRADO, valor: 10000 },
];