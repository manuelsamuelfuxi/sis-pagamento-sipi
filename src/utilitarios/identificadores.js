function gerarUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  // Contextos não seguros (HTTP fora de localhost) não têm randomUUID
  const octetos = globalThis.crypto.getRandomValues(new Uint8Array(16));
  return Array.from(octetos, (o) => o.toString(16).padStart(2, "0")).join("");
}

export function gerarChaveIdempotencia(rupe) {
  return `PAGAMENTO-RUPE-${rupe}-${gerarUuid()}`;
}

// Formato provisório: confirmar com o backend se o recibo tem formato validado
export function gerarNumeroRecibo(data = new Date()) {
  const aleatorio =
    globalThis.crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000_000;
  return `REC-${data.getFullYear()}-${String(aleatorio).padStart(9, "0")}`;
}

// LocalDateTime do Java: sem fuso e sem milissegundos
export function dataHoraLocalIso(data = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())}` +
    `T${p(data.getHours())}:${p(data.getMinutes())}:${p(data.getSeconds())}`
  );
}