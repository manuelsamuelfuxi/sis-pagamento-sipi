import { useState } from "react";
import { ProvedorServicos } from "./contexto/ContextoServicos";
import PaginaLogin from "./paginas/Login/PaginaLogin";
import PaginaMenu from "./paginas/Menu/PaginaMenu";
import PaginaPagamentos from "./paginas/Pagamentos/PaginaPagamentos";
import PaginaValidacao from "./paginas/Validacao/PaginaValidacao";
import PaginaComprovativo from "./paginas/Comprovativo/PaginaComprovativo";
import PaginaConsulta from "./paginas/Consulta/PaginaConsulta";
import PaginaResultadoConsulta from "./paginas/ResultadoConsulta/PaginaResultadoConsulta";

export default function App() {
  const [ecra, setEcra] = useState("login");
  const [rupeSelecionado, setRupeSelecionado] = useState(null);
  const [comprovativo, setComprovativo] = useState(null);
  const [rupeConsultado, setRupeConsultado] = useState(null);

  function aoRupeValido(dados) {
    setRupeSelecionado(dados);
    setEcra("validacao");
  }

  function aoPago(dados) {
    setComprovativo(dados);
    setRupeSelecionado(null);
    setEcra("comprovativo");
  }

  function aoConsultado(dados) {
    setRupeConsultado(dados);
    setEcra("resultadoConsulta");
  }

  function irParaMenu() {
    setRupeConsultado(null);
    setEcra("menu");
  }

  function terminarSessao() {
    setComprovativo(null);
    setRupeSelecionado(null);
    setRupeConsultado(null);
    setEcra("login");
  }

  return (
    <ProvedorServicos>
      {ecra === "login" && <PaginaLogin aoAutenticar={() => setEcra("menu")} />}

      {ecra === "menu" && <PaginaMenu aoEscolher={setEcra} aoExpirar={terminarSessao} />}

      {ecra === "pagamentos" && (
        <PaginaPagamentos aoRupeValido={aoRupeValido} aoCancelar={() => setEcra("menu")} />
      )}

      {ecra === "validacao" && rupeSelecionado && (
        <PaginaValidacao
          rupe={rupeSelecionado.rupe}
          valor={rupeSelecionado.valor}
          aoPago={aoPago}
          aoCancelar={() => setEcra("menu")}
        />
      )}

      {ecra === "comprovativo" && comprovativo && (
        <PaginaComprovativo comprovativo={comprovativo} aoTerminar={terminarSessao} />
      )}

      {ecra === "consulta" && (
        <PaginaConsulta aoRupeValido={aoConsultado} aoCancelar={irParaMenu} />
      )}

      {ecra === "resultadoConsulta" && rupeConsultado && (
        <PaginaResultadoConsulta
          rupe={rupeConsultado.rupe}
          estado={rupeConsultado.estado}
          valor={rupeConsultado.valor}
          aoNovaConsulta={() => setEcra("consulta")}
          aoMenu={irParaMenu}
        />
      )}
    </ProvedorServicos>
  );
}