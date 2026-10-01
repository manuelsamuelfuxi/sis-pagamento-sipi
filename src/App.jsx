import { useState } from "react";
import { ProvedorServicos } from "./contexto/ContextoServicos";
import PaginaLogin from "./paginas/Login/PaginaLogin";

export default function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <ProvedorServicos>
      {autenticado ? (
        <main style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Autenticado ✅</h2>
          <p>Próxima parte: consulta do RUP.</p>
        </main>
      ) : (
        <PaginaLogin aoAutenticar={() => setAutenticado(true)} />
      )}
    </ProvedorServicos>
  );
}