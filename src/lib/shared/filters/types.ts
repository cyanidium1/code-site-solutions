/**
 * Dropdown / pill option shared by all filter surfaces.
 *
 * `key` is the URL-param value (stable, machine-readable — typically a slug).
 * `label` is the locale-resolved display string.
 */
export type FilterOption = { key: string; label: string };
