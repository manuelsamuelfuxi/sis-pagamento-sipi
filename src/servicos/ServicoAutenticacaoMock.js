import { ServicoAutenticacao } from "./ServicoAutenticacao";
import { CREDENCIAIS_MOCK } from "../dados/mock/credenciaisMock";

export class ServicoAutenticacaoMock extends ServicoAutenticacao {
  #tentativasFalhadas = 0;
  #bloqueadoAte = 0;

  async autenticar(pin) {
    await new Promise((r) => setTimeout(r, 700)); // simula a rede

    const agora = Date.now();
    if (agora < this.#bloqueadoAte) {
      return {
        sucesso: false,
        mensagem: "Cartão temporariamente bloqueado.",
        segundosBloqueio: Math.ceil((this.#bloqueadoAte - agora) / 1000),
      };
    }

    if (pin === CREDENCIAIS_MOCK.pin) {
      this.#tentativasFalhadas = 0;
      return { sucesso: true, mensagem: "Bem-vindo!" };
    }

    this.#tentativasFalhadas += 1;
    const restantes = CREDENCIAIS_MOCK.maxTentativas - this.#tentativasFalhadas;

    if (restantes <= 0) {
      this.#tentativasFalhadas = 0;
      this.#bloqueadoAte = agora + CREDENCIAIS_MOCK.segundosBloqueio * 1000;
      return {
        sucesso: false,
        mensagem: "Demasiadas tentativas. Cartão bloqueado.",
        segundosBloqueio: CREDENCIAIS_MOCK.segundosBloqueio,
      };
    }

    return { sucesso: false, mensagem: "PIN incorrecto.", tentativasRestantes: restantes };
  }
}