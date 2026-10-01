import { useEffect, useState } from "react";

export default function CarrosselImagens({ slides, intervaloMs = 3000 }) {
  const [indice, setIndice] = useState(0);
  const total = slides.length;

  // avança sozinho a cada 10 segundos
  useEffect(() => {
    const t = setInterval(() => setIndice((i) => (i + 1) % total), intervaloMs);
    return () => clearInterval(t);
  }, [intervaloMs, total]);

  const atual = slides[indice];

  return (
    <section className="carrossel" aria-roledescription="carrossel">
      {slides.map((s, i) => (
        <img
          key={s.imagem}
          src={s.imagem}
          alt={s.titulo}
          className={`carrossel-imagem ${i === indice ? "ativo" : ""}`}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ))}
      <div className="carrossel-sombra" />

      <div key={indice} className="carrossel-legenda" aria-live="polite">
        <div>
          <h2>{atual.titulo}</h2>
          <p>{atual.texto}</p>
        </div>
      </div>

      <div className="carrossel-controlos" aria-hidden="true">
        <div className="carrossel-pontos">
          {slides.map((s, i) => (
            <span key={s.imagem} className={`carrossel-ponto ${i === indice ? "ativo" : ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}