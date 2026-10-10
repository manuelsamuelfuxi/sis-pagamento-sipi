export class ErroHttp extends Error {
  constructor(tipo, { estado = null, corpo = null } = {}) {
    super(tipo);
    this.name = "ErroHttp";
    this.tipo = tipo; // 'REDE' | 'TEMPO_ESGOTADO' | 'HTTP'
    this.estado = estado;
    this.corpo = corpo;
  }
}

export class ClienteHttp {
  #urlBase;
  #tempoLimiteMs;

  constructor({ urlBase, tempoLimiteMs = 60000 }) {
    this.#urlBase = urlBase.replace(/\/+$/, "");
    this.#tempoLimiteMs = tempoLimiteMs;
  }

  obter(caminho) {
    return this.#pedir("GET", caminho);
  }

  enviar(caminho, corpo, cabecalhos = {}) {
    return this.#pedir("POST", caminho, corpo, cabecalhos);
  }

  async #pedir(metodo, caminho, corpo, cabecalhos = {}) {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), this.#tempoLimiteMs);
    try {
      const resposta = await fetch(`${this.#urlBase}${caminho}`, {
        method: metodo,
        headers: {
          Accept: "application/json",
          ...(corpo !== undefined ? { "Content-Type": "application/json" } : {}),
          ...cabecalhos,
        },
        body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
        signal: controlador.signal,
      });

      const texto = await resposta.text();
      let dados = null;
      if (texto) {
        try {
          dados = JSON.parse(texto);
        } catch {
          dados = texto;
        }
      }

      if (!resposta.ok) {
        throw new ErroHttp("HTTP", { estado: resposta.status, corpo: dados });
      }
      return dados;
    } catch (erro) {
      if (erro instanceof ErroHttp) throw erro;
      if (erro?.name === "AbortError") throw new ErroHttp("TEMPO_ESGOTADO");
      throw new ErroHttp("REDE");
    } finally {
      clearTimeout(temporizador);
    }
  }
}