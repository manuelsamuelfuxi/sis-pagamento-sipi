import { ServicoAutenticacaoMock } from './ServicoAutenticacaoMock';
import { ServicoRupesMock } from './ServicoRupesMock';
import { ServicoRupesApi } from './ServicoRupesApi';
import { ClienteHttp } from './http/ClienteHttp';

export function criarServicos() {
  const usarMock = import.meta.env.VITE_USAR_MOCK !== 'false';

  let rupes;
  if (usarMock) {
    rupes = new ServicoRupesMock();
  } else {
    const urlBase = import.meta.env.VITE_API_URL;
    if (!urlBase) throw new Error('VITE_API_URL não definido com VITE_USAR_MOCK=false');
    rupes = new ServicoRupesApi(new ClienteHttp({ urlBase }));
  }

  return { autenticacao: new ServicoAutenticacaoMock(), rupes };
}