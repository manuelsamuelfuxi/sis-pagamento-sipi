import { CODIGOS_ERRO_RUPE, ErroRupe, ESTADOS_RUPE } from "../ServicoRupes";

function expirou(dataExpiracao, agora) {
  if (!dataExpiracao) return false;
  const limite = new Date(dataExpiracao);
  return !Number.isNaN(limite.getTime()) && limite < agora;
}

function mapearEstado(rupeApi, agora) {
  switch (String(rupeApi.estado).toUpperCase()) {
    case "PAGO":
      return ESTADOS_RUPE.PAGO;
    case "EXPIRADO":
      return ESTADOS_RUPE.EXPIRADO;
    case "ABERTO": // enum visto no Swagger
    case "PENDENTE": // valor usado nos exemplos do README
      // Fallback: o ideal é o backend enviar EXPIRADO
      return expirou(rupeApi.dataExpiracao, agora)
        ? ESTADOS_RUPE.EXPIRADO
        : ESTADOS_RUPE.ABERTO;
    default:
      throw new ErroRupe(CODIGOS_ERRO_RUPE.ERRO_DESCONHECIDO, rupeApi.estado);
  }
}

export function mapearRupe(rupeApi, agora = new Date()) {
  const valor = Number(rupeApi?.valor);
  if (!rupeApi?.referencia || !Number.isFinite(valor)) {
    throw new ErroRupe(CODIGOS_ERRO_RUPE.ERRO_DESCONHECIDO, rupeApi);
  }
  return {
    rupe: String(rupeApi.referencia),
    estado: mapearEstado(rupeApi, agora),
    valor,
  };
}

export function mapearPagamento(pagamentoApi) {
  const valor = Number(pagamentoApi?.valor);
  if (
    !pagamentoApi?.numeroRecibo ||
    !pagamentoApi?.referencia ||
    !Number.isFinite(valor)
  ) {
    throw new ErroRupe(CODIGOS_ERRO_RUPE.ERRO_DESCONHECIDO, pagamentoApi);
  }
  return {
    numeroTransacao: pagamentoApi.numeroRecibo,
    rupe: String(pagamentoApi.referencia),
    valor,
    dataHora: pagamentoApi.dataPagamento,
  };
}