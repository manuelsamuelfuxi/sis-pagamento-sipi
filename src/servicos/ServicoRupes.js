export const ESTADOS_RUPE = {
  ABERTO: "aberto",
  PAGO: "pago",
  EXPIRADO: "expirado",
};

export const CODIGOS_ERRO_RUPE = {
  NAO_ENCONTRADO: "NAO_ENCONTRADO",
  FORMATO_INVALIDO: "FORMATO_INVALIDO",
};

export class ErroRupe extends Error {
  constructor(codigo) {
    super(codigo);
    this.codigo = codigo;
  }
}

export class ServicoRupes {
  // devolve { rupe, estado, valor } ou lança ErroRupe
  async consultar(rupe) {
    throw new Error("consultar não implementado");
  }
}