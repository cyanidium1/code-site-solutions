import type * as React from "react";
import type { LucideIcon } from "lucide-react";

export type MarqueeLogo = { src: string; alt: string };

export type Industry = {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  tags: string[];
  price: string;
  /** `null` rendert die Karte als nicht-klickbar (для EN-локалі, поки не вийшли галузеві лендинги). */
  href: string | null;
};

export type BentoVisualKind =
  | "lh"
  | "mig"
  | "commits"
  | "weeks"
  | "price"
  | "warranty"
  | "support"
  | "stack";

export type BentoCell = {
  title: string;
  icon: LucideIcon;
  stat?: string;
  body: React.ReactNode;
  span: "1x1" | "2x1" | "2x2" | "3x1";
  visual?: BentoVisualKind;
};
