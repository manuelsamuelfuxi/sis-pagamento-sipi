import { CODIGOS_ERRO_RUPE, ErroRupe } from "../servicos/ServicoRupes";

const MENSAGENS = {
  [CODIGOS_ERRO_RUPE.NAO_ENCONTRADO]: "RUPE não encontrado.",
  [CODIGOS_ERRO_RUPE.FORMATO_INVALIDO]: "Formato de RUPE inválido.",
  [CODIGOS_ERRO_RUPE.JA_PAGO]: "Este RUPE já foi pago.",
  [CODIGOS_ERRO_RUPE.EXPIRADO]: "Este RUPE está expirado.",
  [CODIGOS_ERRO_RUPE.SERVICO_INDISPONIVEL]:
    "Serviço indisponível. Tente novamente dentro de instantes.",
  [CODIGOS_ERRO_RUPE.ERRO_DESCONHECIDO]:
    "Não foi possível concluir a operação.",
};

export function mensagemDoErroRupe(erro) {
  const codigo =
    erro instanceof ErroRupe ? erro.codigo : CODIGOS_ERRO_RUPE.ERRO_DESCONHECIDO;
  return MENSAGENS[codigo] ?? MENSAGENS[CODIGOS_ERRO_RUPE.ERRO_DESCONHECIDO];
}