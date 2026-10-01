import { RUPES_MOCK } from "../dados/mock/rupesMock";
import { ServicoRupes, ErroRupe, CODIGOS_ERRO_RUPE } from "./ServicoRupes";

const ATRASO_MS = 600;
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class ServicoRupesMock extends ServicoRupes {
  constructor() {
    super();
    // cópia, para nunca alterar o array original do mock
    this.rupes = RUPES_MOCK.map((r) => ({ ...r }));
  }

  async consultar(rupe) {
    await esperar(ATRASO_MS);

    if (!/^\d{20}$/.test(rupe)) {
      throw new ErroRupe(CODIGOS_ERRO_RUPE.FORMATO_INVALIDO);
    }
    const encontrado = this.rupes.find((r) => r.rupe === rupe);
    if (!encontrado) {
      throw new ErroRupe(CODIGOS_ERRO_RUPE.NAO_ENCONTRADO);
    }
    return { ...encontrado };
  }
}