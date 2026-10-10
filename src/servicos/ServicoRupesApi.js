import {
  CODIGOS_ERRO_RUPE,
  ErroRupe,
  ESTADOS_RUPE,
  ServicoRupes,
} from "./ServicoRupes";
import { ErroHttp } from "./http/ClienteHttp";
import { mapearRupe, mapearPagamento } from "./mapeadores/mapeadorRupe";
import { codigoRupeDoCorpo } from "./mapeadores/mapeadorErroApi";
import {
  dataHoraLocalIso,
  gerarChaveIdempotencia,
  gerarNumeroRecibo,
} from "../utilitarios/identificadores";

const FORMATO_RUPE = /^\d{20}$/;

export class ServicoRupesApi extends ServicoRupes {
  #cliente;
  // RUPE -> { chave, numeroRecibo, dataPagamento } (tentativa sem resultado definitivo)
  #tentativas = new Map();
  // RUPE -> Promise (impede dois pagamentos simultâneos do mesmo RUPE)
  #pagamentosEmCurso = new Map();

  constructor(cliente) {
    super();
    this.#cliente = cliente;
  }

  async consultar(rupe) {
    if (!FORMATO_RUPE.test(rupe)) {
      throw new ErroRupe(CODIGOS_ERRO_RUPE.FORMATO_INVALIDO);
    }
    try {
      const resposta = await this.#cliente.obter(
        `/rupes/${encodeURIComponent(rupe)}`,
      );
      return mapearRupe(resposta);
    } catch (erro) {
      throw this.#traduzirErro(erro);
    }
  }

  pagar(rupe) {
    const emCurso = this.#pagamentosEmCurso.get(rupe);
    if (emCurso) return emCurso;

    const operacao = this.#executarPagamento(rupe).finally(() =>
      this.#pagamentosEmCurso.delete(rupe),
    );
    this.#pagamentosEmCurso.set(rupe, operacao);
    return operacao;
  }

  async #executarPagamento(rupe) {
    let tentativa = this.#tentativas.get(rupe);

    if (!tentativa) {
      // Revalida: não confia na consulta anterior
      const actual = await this.consultar(rupe);
      if (actual.estado === ESTADOS_RUPE.PAGO) {
        throw new ErroRupe(CODIGOS_ERRO_RUPE.JA_PAGO);
      }
      if (actual.estado === ESTADOS_RUPE.EXPIRADO) {
        throw new ErroRupe(CODIGOS_ERRO_RUPE.EXPIRADO);
      }
      tentativa = {
        chave: gerarChaveIdempotencia(rupe),
        numeroRecibo: gerarNumeroRecibo(),
        dataPagamento: dataHoraLocalIso(),
      };
      this.#tentativas.set(rupe, tentativa);
    }
    // Se já existe tentativa (resultado incerto), reenvia com a mesma chave e o mesmo
    // corpo, sem pré-validar: o RUPE pode já estar PAGO pelo primeiro envio.

    try {
      const resposta = await this.#cliente.enviar(
        "/pagamentos",
        {
          referencia: rupe,
          numeroRecibo: tentativa.numeroRecibo,
          dataPagamento: tentativa.dataPagamento,
        },
        { "Idempotency-Key": tentativa.chave },
      );
      this.#tentativas.delete(rupe);
      return mapearPagamento(resposta);
    } catch (erro) {
      throw await this.#traduzirErroPagamento(erro, rupe);
    }
  }

  async #traduzirErroPagamento(erro, rupe) {
    const definitivo =
      erro instanceof ErroRupe ||
      (erro instanceof ErroHttp &&
        erro.tipo === "HTTP" &&
        erro.estado >= 400 &&
        erro.estado < 500);

    // Rede, timeout ou 5xx: resultado incerto, mantém a tentativa para repetição segura
    if (!definitivo) return this.#traduzirErro(erro);

    this.#tentativas.delete(rupe);
    if (erro instanceof ErroRupe) return erro;

    const codigoConhecido = codigoRupeDoCorpo(erro.corpo);
    if (codigoConhecido) return new ErroRupe(codigoConhecido);
    if (erro.estado === 404) return new ErroRupe(CODIGOS_ERRO_RUPE.NAO_ENCONTRADO);

    // PROVISÓRIO: outro 4xx sem código conhecido. Descobre o motivo consultando o estado
    // real, até os códigos de pagamento do backend serem observados.
    try {
      const actual = await this.consultar(rupe);
      if (actual.estado === ESTADOS_RUPE.PAGO) {
        return new ErroRupe(CODIGOS_ERRO_RUPE.JA_PAGO);
      }
      if (actual.estado === ESTADOS_RUPE.EXPIRADO) {
        return new ErroRupe(CODIGOS_ERRO_RUPE.EXPIRADO);
      }
    } catch {
      /* cai no erro genérico */
    }
    return new ErroRupe(CODIGOS_ERRO_RUPE.ERRO_DESCONHECIDO, erro.corpo);
  }

  #traduzirErro(erro) {
    if (erro instanceof ErroRupe) return erro;
    if (erro instanceof ErroHttp) {
      if (erro.tipo !== "HTTP" || erro.estado >= 500) {
        return new ErroRupe(CODIGOS_ERRO_RUPE.SERVICO_INDISPONIVEL, erro);
      }
      const codigoConhecido = codigoRupeDoCorpo(erro.corpo);
      if (codigoConhecido) return new ErroRupe(codigoConhecido);
      if (erro.estado === 404) return new ErroRupe(CODIGOS_ERRO_RUPE.NAO_ENCONTRADO);
      if (erro.estado === 400) return new ErroRupe(CODIGOS_ERRO_RUPE.FORMATO_INVALIDO);
    }
    return new ErroRupe(CODIGOS_ERRO_RUPE.ERRO_DESCONHECIDO, erro);
  }
}