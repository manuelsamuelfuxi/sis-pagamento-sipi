export const formatarRupe = (rupe) => rupe.replace(/(\d{3})(?=\d)/g, "$1 ");

export const formatarValor = (valor) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(valor);

export const formatarDataHora = (iso) =>
  new Intl.DateTimeFormat("pt-AO", { dateStyle: "medium", timeStyle: "medium" }).format(new Date(iso));