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
};

export class ErroRupe extends Error {
  constructor(codigo) {
    super(codigo);
    this.codigo = codigo;
  }
}

export class ServicoRupes {
  async consultar(rupe) {
    throw new Error("consultar não implementado");
  }

  // devolve { numeroTransacao, rupe, valor, dataHora } ou lança ErroRupe
  async pagar(rupe) {
    throw new Error("pagar não implementado");
  }
}