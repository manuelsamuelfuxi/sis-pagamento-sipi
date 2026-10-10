export const ESTADOS_RUPE = {
  ABERTO: "aberto",
  PAGO: "pago",
  EXPIRADO: "expirado",
};

export const CODIGOS_ERRO_RUPE = {
  NAO_ENCONTRADO: "NAO_ENCONTRADO",
  FORMATO_INVALIDO: "FORMATO_INVALIDO",
  JA_PAGO: "JA_PAGO",
  EXPIRADO: "EXPIRADO",
  SERVICO_INDISPONIVEL: "SERVICO_INDISPONIVEL",
  ERRO_DESCONHECIDO: "ERRO_DESCONHECIDO",
};

export class ErroRupe extends Error {
  constructor(codigo, causa) {
    super(codigo);
    this.name = "ErroRupe";
    this.codigo = codigo;
    if (causa !== undefined) this.causa = causa;
  }
}

export class ServicoRupes {
  // devolve { rupe, estado, valor } ou lança ErroRupe
  async consultar(rupe) {
    throw new Error("consultar não implementado");
  }

  // devolve { numeroTransacao, rupe, valor, dataHora } ou lança ErroRupe
  async pagar(rupe) {
    throw new Error("pagar não implementado");
  }
}