export default function IndicadorPin({ total, preenchidos, erro }) {
  return (
    <div className={`indicador-pin ${erro ? "tremer" : ""}`} aria-label="Dígitos introduzidos">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`ponto ${i < preenchidos ? "ativo" : ""}`} />
      ))}
    </div>
  );
}