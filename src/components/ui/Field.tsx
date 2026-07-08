"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "./cn";

/**
 * Form field primitives (Input / Textarea) — the in-house replacement for the
 * HeroUI ones (removed 2026-07, see docs/superpowers/specs/
 * 2026-07-08-drop-heroui-and-split-css-design.md). Native controls in a
 * label / wrapper / description / error shell:
 *
 *   <div>                          ← root
 *     <label>                      ← classNames.label
 *     <div>                        ← classNames.wrapper (border/bg/focus ring)
 *       <input|textarea>           ← classNames.input
 *     <p description>              ← classNames.description
 *     <p error>                    ← classNames.error
 *
 * Focus styling uses `focus-within:` on the wrapper (replaces HeroUI's
 * `data-[focus=true]` slot attr, so no `!important` overrides are needed).
 * Invalid state is driven by `aria-invalid` on the control + `data-invalid`
 * on the wrapper. Native attributes spread onto the control, so formik's
 * `{...field}` (name/value/onChange/onBlur) works untouched.
 */

export type FieldClassNames = {
  label?: string;
  wrapper?: string;
  input?: string;
  description?: string;
  error?: string;
};

type FieldShellProps = {
  label?: ReactNode;
  isRequired?: boolean;
  description?: ReactNode;
  errorMessage?: ReactNode;
  isInvalid?: boolean;
  classNames?: FieldClassNames;
};

// Default visual treatment = the lead-form spec (the most common surface).
// Call sites with a different identity (calculator) override via classNames.
const LABEL_BASE = "text-ink-dim font-medium text-[13px] tracking-[0.005em]";

const REQUIRED_STAR_CLASS = "text-accent-soft";

const WRAPPER_BASE =
  "flex rounded-xl border border-line-strong bg-[oklch(0.16_0.005_300/0.7)] " +
  "transition-[border-color,background-color] duration-200 " +
  "hover:border-ink-3 hover:bg-[oklch(0.16_0.005_300/0.9)] " +
  "focus-within:border-accent-soft focus-within:bg-[oklch(0.18_0.01_300/0.95)] " +
  "focus-within:hover:border-accent-soft " +
  "data-[invalid=true]:border-[oklch(0.65_0.18_25)]";

const INPUT_BASE =
  "w-full min-h-10 bg-transparent border-none outline-none px-3 py-2 " +
  "text-ink font-sans text-[14px] tracking-[0.005em] " +
  "placeholder:text-ink-3 placeholder:font-sans";

const DESCRIPTION_BASE = "text-ink-3 text-[12px] leading-[1.4]";

const ERROR_BASE = "text-[oklch(0.78_0.14_25)] text-[12px] leading-[1.4]";

function FieldShell({
  id,
  descriptionId,
  errorId,
  label,
  isRequired,
  description,
  errorMessage,
  isInvalid,
  classNames,
  children,
}: FieldShellProps & {
  id: string;
  descriptionId: string;
  errorId: string;
  children: ReactNode;
}) {
  const showError = Boolean(isInvalid && errorMessage);
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className={cn(LABEL_BASE, classNames?.label)}>
          {label}
          {isRequired ? (
            <span aria-hidden="true" className={REQUIRED_STAR_CLASS}>
              {" *"}
            </span>
          ) : null}
        </label>
      ) : null}
      <div
        className={cn(WRAPPER_BASE, classNames?.wrapper)}
        data-invalid={isInvalid || undefined}
      >
        {children}
      </div>
      {description ? (
        <p id={descriptionId} className={cn(DESCRIPTION_BASE, classNames?.description)}>
          {description}
        </p>
      ) : null}
      {/* Always-mounted live region so screen readers announce the error when it appears. */}
      <p
        id={errorId}
        aria-live="polite"
        className={cn(ERROR_BASE, classNames?.error, !showError && "hidden")}
      >
        {showError ? errorMessage : null}
      </p>
    </div>
  );
}

/** aria-describedby chain: description + visible error, omitting absent ids. */
function describedBy(
  descriptionId: string,
  errorId: string,
  hasDescription: boolean,
  showError: boolean,
): string | undefined {
  const ids = [hasDescription ? descriptionId : null, showError ? errorId : null]
    .filter(Boolean)
    .join(" ");
  return ids || undefined;
}

export type InputProps = FieldShellProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export function Input({
  label,
  isRequired,
  description,
  errorMessage,
  isInvalid,
  classNames,
  ...rest
}: InputProps) {
  const uid = useId();
  const id = rest.id ?? uid;
  const descriptionId = `${id}-desc`;
  const errorId = `${id}-err`;
  const showError = Boolean(isInvalid && errorMessage);
  return (
    <FieldShell
      id={id}
      descriptionId={descriptionId}
      errorId={errorId}
      label={label}
      isRequired={isRequired}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      classNames={classNames}
    >
      <input
        {...rest}
        id={id}
        required={rest.required ?? isRequired}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy(descriptionId, errorId, Boolean(description), showError)}
        className={cn(INPUT_BASE, classNames?.input)}
      />
    </FieldShell>
  );
}

export type TextareaProps = FieldShellProps & {
  /** Initial visible rows (maps to the native `rows` attribute). */
  minRows?: number;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

export function Textarea({
  label,
  isRequired,
  description,
  errorMessage,
  isInvalid,
  classNames,
  minRows = 3,
  ...rest
}: TextareaProps) {
  const uid = useId();
  const id = rest.id ?? uid;
  const descriptionId = `${id}-desc`;
  const errorId = `${id}-err`;
  const showError = Boolean(isInvalid && errorMessage);
  return (
    <FieldShell
      id={id}
      descriptionId={descriptionId}
      errorId={errorId}
      label={label}
      isRequired={isRequired}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      classNames={classNames}
    >
      <textarea
        {...rest}
        id={id}
        rows={rest.rows ?? minRows}
        required={rest.required ?? isRequired}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy(descriptionId, errorId, Boolean(description), showError)}
        className={cn(INPUT_BASE, "resize-none leading-[1.5]", classNames?.input)}
      />
    </FieldShell>
  );
}
