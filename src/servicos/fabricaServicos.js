import { ServicoAutenticacaoMock } from "./ServicoAutenticacaoMock";
import { ServicoAutenticacaoApi } from "./ServicoAutenticacaoApi";

const usarMock = import.meta.env.VITE_USAR_MOCK !== "false";
const urlApi = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export function criarServicos() {
  return {
    autenticacao: usarMock
      ? new ServicoAutenticacaoMock()
      : new ServicoAutenticacaoApi(urlApi),
  };
}