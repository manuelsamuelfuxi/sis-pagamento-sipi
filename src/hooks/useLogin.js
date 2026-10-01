import { useCallback, useEffect, useState } from "react";
import { useServicos } from "../contexto/ContextoServicos";

const TAMANHO_PIN = 4;

export function useLogin(aoAutenticar) {
  const { autenticacao } = useServicos();
  const [pin, setPin] = useState("");
  const [aProcessar, setAProcessar] = useState(false);
  const [erro, setErro] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [segundosBloqueio, setSegundosBloqueio] = useState(0);

  // contagem decrescente do bloqueio
  useEffect(() => {
    if (segundosBloqueio <= 0) return;
    const t = setTimeout(() => setSegundosBloqueio((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundosBloqueio]);

  const bloqueado = segundosBloqueio > 0;

  const confirmar = useCallback(
    async (pinFinal) => {
      setAProcessar(true);
      const resposta = await autenticacao.autenticar(pinFinal);
      setAProcessar(false);

      if (resposta.sucesso) {
        setMensagem(resposta.mensagem);
        aoAutenticar();
        return;
      }

      setErro(true);
      setPin("");
      setSegundosBloqueio(resposta.segundosBloqueio ?? 0);
      setMensagem(
        resposta.tentativasRestantes != null
          ? `${resposta.mensagem} Restam ${resposta.tentativasRestantes} tentativa(s).`
          : resposta.mensagem
      );
      setTimeout(() => setErro(false), 500); // termina a animação de tremor
    },
    [autenticacao, aoAutenticar]
  );

  const adicionarDigito = useCallback(
    (digito) => {
      if (aProcessar || bloqueado || pin.length >= TAMANHO_PIN) return;
      const novo = pin + digito;
      setPin(novo);
      if (novo.length === TAMANHO_PIN) confirmar(novo);
    },
    [pin, aProcessar, bloqueado, confirmar]
  );

  const apagarDigito = useCallback(() => {
    if (aProcessar || bloqueado) return;
    setPin((p) => p.slice(0, -1));
  }, [aProcessar, bloqueado]);

  const limpar = useCallback(() => {
    if (aProcessar || bloqueado) return;
    setPin("");
  }, [aProcessar, bloqueado]);

  return {
    pin, tamanhoPin: TAMANHO_PIN, aProcessar, erro, mensagem,
    bloqueado, segundosBloqueio, adicionarDigito, apagarDigito, limpar,
  };
}