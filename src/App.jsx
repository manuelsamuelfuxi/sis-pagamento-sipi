import { useState } from "react";
import { ProvedorServicos } from "./contexto/ContextoServicos";
import PaginaLogin from "./paginas/Login/PaginaLogin";
import PaginaMenu from "./paginas/Menu/PaginaMenu";
import PaginaPagamentos from "./paginas/Pagamentos/PaginaPagamentos";
import PaginaValidacao from "./paginas/Validacao/PaginaValidacao";

export default function App() {
  const [ecra, setEcra] = useState("login");
  const [rupeSelecionado, setRupeSelecionado] = useState(null);

  function aoRupeValido(dados) {
    setRupeSelecionado(dados);
    setEcra("validacao");
  }

  return (
    <ProvedorServicos>
      {ecra === "login" && <PaginaLogin aoAutenticar={() => setEcra("menu")} />}

      {ecra === "menu" && (
        <PaginaMenu aoEscolher={setEcra} aoExpirar={() => setEcra("login")} />
      )}

      {ecra === "pagamentos" && (
        <PaginaPagamentos aoRupeValido={aoRupeValido} aoCancelar={() => setEcra("login")} />
      )}

      {ecra === "validacao" && rupeSelecionado && (
        <PaginaValidacao
          rupe={rupeSelecionado.rupe}
          valor={rupeSelecionado.valor}
          aoConfirmar={() => console.log("Confirmado:", rupeSelecionado)}
          aoCancelar={() => setEcra("login")}
        />
      )}

      {ecra === "consulta" && (
        <main style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Consulta (em construção)</h2>
          <button onClick={() => setEcra("menu")}>Voltar</button>
        </main>
      )}
    </ProvedorServicos>
  );
}