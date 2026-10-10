import { CODIGOS_ERRO_RUPE } from "../ServicoRupes";

// Campo `error` do corpo de erro do backend -> código de erro do frontend.
// Só está aqui o que foi observado. Acrescentar os restantes (RUPE paga, expirada, etc.)
// quando aparecerem nas respostas reais.
const CODIGOS_API = {
  RUPE_NOT_FOUND: CODIGOS_ERRO_RUPE.NAO_ENCONTRADO,
};

export function codigoRupeDoCorpo(corpo) {
  const codigoApi =
    corpo && typeof corpo === "object" ? corpo.error : undefined;
  return CODIGOS_API[codigoApi] ?? null;
}