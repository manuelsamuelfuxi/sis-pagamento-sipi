import { ServicoAutenticacao } from "./ServicoAutenticacao";

// Pronto para o Spring Boot. Ajusta a rota quando o endpoint existir.
export class ServicoAutenticacaoApi extends ServicoAutenticacao {
  constructor(urlBase) {
    super();
    this.urlBase = urlBase;
  }

  async autenticar(pin) {
    const resposta = await fetch(`${this.urlBase}/autenticacao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    return resposta.json(); // o frontend só apresenta o que a API devolve
  }
}