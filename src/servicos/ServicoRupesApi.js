import { ServicoRupes } from "./ServicoRupes";

export class ServicoRupesApi extends ServicoRupes {
  constructor(urlApi) {
    super();
    this.urlApi = urlApi;
  }

  async consultar() {
    throw new Error("ServicoRupesApi.consultar ainda não implementado");
  }
}