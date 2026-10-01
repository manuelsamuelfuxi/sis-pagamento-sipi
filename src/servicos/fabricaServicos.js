import { ServicoAutenticacaoMock } from "./ServicoAutenticacaoMock";
import { ServicoAutenticacaoApi } from "./ServicoAutenticacaoApi";
import { ServicoRupesMock } from "./ServicoRupesMock";
import { ServicoRupesApi } from "./ServicoRupesApi";

const usarMock = import.meta.env.VITE_USAR_MOCK !== "false";
const urlApi = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export function criarServicos() {
  return {
    autenticacao: usarMock
      ? new ServicoAutenticacaoMock()
      : new ServicoAutenticacaoApi(urlApi),
    rupes: usarMock
      ? new ServicoRupesMock()
      : new ServicoRupesApi(urlApi),
  };
}