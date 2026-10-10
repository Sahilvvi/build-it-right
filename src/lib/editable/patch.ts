import { getAdminStore } from "../admin-store";

/**
 * Text layer for the public site.
 *
 * Public-site source files opt in with a `@jsxImportSource @/lib/editable` pragma on their first
 * line. Their JSX is then compiled through the wrappers in jsx-runtime.ts, which call `patchProps`
 * for every element:
 *   * any string rendered as a child is swapped for the admin's replacement (if there is one)
 *   * `href` on <a>, `src`/`alt` on <img> and `placeholder` on inputs can be replaced too
 * Replacements are keyed by the ORIGINAL text, so page code never changes. While an admin has the
 * site editor open, every string seen is also recorded so the editor can list what is on the page.
 */
export type EntryKind = "text" | "href" | "src" | "alt" | "ph";

export interface SeenEntry {
  kind: EntryKind;
  /** The original (un-overridden) value, trimmed. */
  value: string;
}

const PREFIX: Record<EntryKind, string> = {
  text: "",
  href: "href:",
  src: "src:",
  alt: "alt:",
  ph: "ph:",
};

const HOST_PROPS: Record<string, Array<[prop: string, kind: EntryKind]>> = {
  a: [["href", "href"]],
  img: [
    ["src", "src"],
    ["alt", "alt"],
  ],
  input: [["placeholder", "ph"]],
  textarea: [["placeholder", "ph"]],
};

let collecting = false;
let seen = new Map<string, SeenEntry>();
const seenSections = new Map<string, string>();

export function startCollecting() {
  collecting = true;
  seen = new Map();
  seenSections.clear();
}
export function stopCollecting() {
  collecting = false;
}
export const getSeen = () => [...seen.entries()].map(([key, v]) => ({ key, ...v }));
export const getSeenSections = () =>
  [...seenSections.entries()].map(([key, label]) => ({ key, label }));
export function recordSection(key: string, label: string) {
  if (collecting) seenSections.set(key, label);
}

/**
 * Build output (/assets/hero-AbC123.jpg) gets a new hash on every deploy, so overrides must not key
 * on it. Files from /public and external images keep their full name.
 */
export function normaliseSrc(src: string): string {
  const clean = src.split(/[?#]/)[0];
  const name = clean.split("/").pop() ?? clean;
  if (!clean.includes("/assets/")) return name;
  const m = name.match(/^(.+?)-[A-Za-z0-9_]{6,12}(\.[a-z0-9]+)$/i);
  return m ? `${m[1]}${m[2]}` : name;
}

const worthRecording = (kind: EntryKind, v: string) => {
  if (kind === "text") return /[A-Za-z]{2}/.test(v) && v.length <= 800;
  if (kind === "href") return /^(https?:|mailto:|tel:)/i.test(v);
  if (kind === "src") return v.length > 3 && !v.startsWith("data:");
  return v.trim().length > 1;
};

function lookupKey(kind: EntryKind, value: string) {
  return PREFIX[kind] + (kind === "src" ? normaliseSrc(value) : value);
}

let lastRef: Record<string, string> | undefined;
let lastHas = false;
function activeOverrides(): Record<string, string> | null {
  const ref = getAdminStore().textOverrides;
  if (ref !== lastRef) {
    lastRef = ref;
    lastHas = !!ref && Object.keys(ref).length > 0;
  }
  return lastHas ? ref : null;
}

function mapValue(kind: EntryKind, raw: string, overrides: Record<string, string> | null): string {
  const value = raw.trim();
  if (!value) return raw;
  if (collecting && worthRecording(kind, value)) {
    const key = lookupKey(kind, value);
    if (!seen.has(key)) seen.set(key, { kind, value });
  }
  if (!overrides) return raw;
  const replacement = overrides[lookupKey(kind, value)];
  if (!replacement) return raw;
  if (kind !== "text") return replacement;
  // keep the original surrounding whitespace so inline fragments still space correctly
  const lead = raw.slice(0, raw.indexOf(value));
  const trail = raw.slice(raw.indexOf(value) + value.length);
  return lead + replacement + trail;
}

export function patchProps<P extends Record<string, unknown>>(type: unknown, props: P): P {
  const overrides = activeOverrides();
  if (!overrides && !collecting) return props;

  let out: Record<string, unknown> = props;
  const children = props.children;
  if (typeof children === "string") {
    const next = mapValue("text", children, overrides);
    if (next !== children) out = { ...out, children: next };
  } else if (Array.isArray(children)) {
    let changed = false;
    const next = children.map((c) => {
      if (typeof c !== "string") return c;
      const r = mapValue("text", c, overrides);
      if (r !== c) changed = true;
      return r;
    });
    if (changed) out = { ...out, children: next };
  }

  if (typeof type === "string") {
    const hostProps = HOST_PROPS[type];
    if (hostProps) {
      for (const [name, kind] of hostProps) {
        const v = props[name];
        if (typeof v !== "string") continue;
        const r = mapValue(kind, v, overrides);
        if (r !== v) out = out === props ? { ...props, [name]: r } : { ...out, [name]: r };
      }
    }
  }
  return out as P;
}
