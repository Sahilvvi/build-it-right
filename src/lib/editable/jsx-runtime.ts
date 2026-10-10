import * as React from "react/jsx-runtime";
import { patchProps } from "./patch";

export type { JSX } from "react/jsx-runtime";

export const Fragment = React.Fragment;

export function jsx(type: unknown, props: Record<string, unknown>, key?: unknown) {
  return (React.jsx as (...a: unknown[]) => unknown)(type, patchProps(type, props), key);
}
export function jsxs(type: unknown, props: Record<string, unknown>, key?: unknown) {
  return (React.jsxs as (...a: unknown[]) => unknown)(type, patchProps(type, props), key);
}
