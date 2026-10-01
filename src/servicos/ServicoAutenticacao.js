// Contrato: tudo o que a interface precisa de saber sobre autenticação.
// Resposta esperada: { sucesso, mensagem, tentativasRestantes?, segundosBloqueio? }
export class ServicoAutenticacao {
  async autenticar(pin) {
    throw new Error("ServicoAutenticacao.autenticar não implementado");
  }
}