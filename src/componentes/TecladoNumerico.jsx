import { IconeApagar } from "./Icones";

const DIGITOS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function TecladoNumerico({ aoDigitar, aoApagar, aoLimpar, desativado }) {
  return (
    <div className="teclado">
      {DIGITOS.map((d) => (
        <button key={d} className="tecla" disabled={desativado} onClick={() => aoDigitar(d)}>
          {d}
        </button>
      ))}
      <button className="tecla tecla-limpar" disabled={desativado} onClick={aoLimpar}>
        Limpar
      </button>
      <button className="tecla" disabled={desativado} onClick={() => aoDigitar("0")}>
        0
      </button>
      <button className="tecla tecla-apagar" disabled={desativado} onClick={aoApagar} aria-label="Apagar">
        <IconeApagar />
      </button>
    </div>
  );
}