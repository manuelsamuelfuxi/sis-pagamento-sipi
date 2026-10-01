import { createContext, useContext, useMemo } from "react";
import { criarServicos } from "../servicos/fabricaServicos";

const ContextoServicos = createContext(null);

export function ProvedorServicos({ children }) {
  const servicos = useMemo(() => criarServicos(), []);
  return <ContextoServicos.Provider value={servicos}>{children}</ContextoServicos.Provider>;
}

export function useServicos() {
  const ctx = useContext(ContextoServicos);
  if (!ctx) throw new Error("useServicos deve estar dentro de ProvedorServicos");
  return ctx;
}