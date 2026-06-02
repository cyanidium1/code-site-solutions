"use client";

import { createContext, useContext, type ReactNode } from "react";

const CaseCountContext = createContext<number | null>(null);

export function CaseCountProvider({
  count,
  children,
}: {
  count: number;
  children: ReactNode;
}) {
  return (
    <CaseCountContext.Provider value={count}>{children}</CaseCountContext.Provider>
  );
}

export function useCaseCount(): number | null {
  return useContext(CaseCountContext);
}
