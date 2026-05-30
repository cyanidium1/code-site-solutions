"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import {
  FALLBACK_REGISTRY,
  fromWire,
  type EnRegistry,
  type EnRegistryWire,
} from "@/lib/shared/i18n-registry-types";

/**
 * React context exposing the EN-availability registry to client
 * components (locale switcher, services dropdown, footer industry list).
 *
 * The server fetches the registry once per layout render and passes the
 * data via the wire-format `value` prop. We reconstruct `Set`/`Map` here
 * on the client (cheap, runs once via `useMemo`) instead of relying on
 * Next 15 RSC serialization of those types — arrays + tuples are stable
 * across every Next/React combo.
 *
 * Defaults to `FALLBACK_REGISTRY` so a consumer rendered outside the
 * provider (e.g. in a Storybook test) still gets sensible behaviour.
 */
const I18nRegistryContext = createContext<EnRegistry>(FALLBACK_REGISTRY);

export function I18nRegistryProvider({
  value,
  children,
}: {
  value: EnRegistryWire;
  children: ReactNode;
}) {
  // `value` is a stable per-render object from the server. `useMemo`
  // keyed on its fields lets us reuse the reconstructed registry across
  // re-renders that don't actually change content.
  const registry = useMemo<EnRegistry>(
    () => fromWire(value),
    [value.industries, value.cases, value.blogPairs],
  );
  return (
    <I18nRegistryContext.Provider value={registry}>
      {children}
    </I18nRegistryContext.Provider>
  );
}

/**
 * Read the EN-availability registry inside any client component. Always
 * returns a registry (defaulting to `FALLBACK_REGISTRY` when no provider
 * is mounted) so callers never need to null-check.
 */
export function useI18nRegistry(): EnRegistry {
  return useContext(I18nRegistryContext);
}
