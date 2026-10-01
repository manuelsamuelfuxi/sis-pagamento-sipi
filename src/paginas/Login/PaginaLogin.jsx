import { useEffect } from "react";
import { useLogin } from "../../hooks/useLogin";
import IndicadorPin from "../../componentes/IndicadorPin";
import TecladoNumerico from "../../componentes/TecladoNumerico";
import CarrosselImagens from "../../componentes/CarrosselImagens";
import { SLIDES_MOCK } from "../../dados/mock/slidesMock";
import "./PaginaLogin.css";

export default function PaginaLogin({ aoAutenticar }) {
  const login = useLogin(aoAutenticar);
  const { adicionarDigito, apagarDigito } = login;

  // suporte ao teclado físico
  useEffect(() => {
    const aoPremir = (e) => {
      if (/^\d$/.test(e.key)) adicionarDigito(e.key);
      else if (e.key === "Backspace") apagarDigito();
    };
    window.addEventListener("keydown", aoPremir);
    return () => window.removeEventListener("keydown", aoPremir);
  }, [adicionarDigito, apagarDigito]);

  const desativado = login.aProcessar || login.bloqueado;

  const textoEstado = login.bloqueado
    ? `Bloqueado. Aguarde ${login.segundosBloqueio}s`
    : login.aProcessar
    ? "A verificar..."
    : login.mensagem;

  return (
    <div className="login">
      <header className="topo">
        <div className="marca">
          <span className="marca-sigla">SPS</span>
          <span className="marca-divisor" />
          <span className="marca-nome">
            SISTEMA DE<br />PAGAMENTO SIMULADO
          </span>
        </div>
        <ul className="lemas">
          <li>Rápido</li>
          <li>Seguro</li>
          <li>Sempre consigo</li>
        </ul>
      </header>

      <main className="conteudo">
        <CarrosselImagens slides={SLIDES_MOCK} />

        <section className="cartao-pin">
          <h1 className="cartao-titulo">
            Introduza o seu<strong>PIN</strong>
          </h1>

          <IndicadorPin total={login.tamanhoPin} preenchidos={login.pin.length} erro={login.erro} />

          <p className={`estado ${login.erro || login.bloqueado ? "erro" : ""}`} role="status">
            {textoEstado}
          </p>

          <TecladoNumerico
            aoDigitar={login.adicionarDigito}
            aoApagar={login.apagarDigito}
            aoLimpar={login.limpar}
            desativado={desativado}
          />
        </section>
      </main>

      <footer className="rodape">
        <span>Desenvolvido por Grupo 9</span>
      </footer>
    </div>
  );
}