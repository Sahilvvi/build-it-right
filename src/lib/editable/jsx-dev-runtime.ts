import * as React from "react/jsx-dev-runtime";
import { patchProps } from "./patch";

export type { JSX } from "react/jsx-dev-runtime";

export const Fragment = React.Fragment;

export function jsxDEV(
  type: unknown,
  props: Record<string, unknown>,
  key: unknown,
  isStatic: boolean,
  source: unknown,
  self: unknown,
) {
  return (React.jsxDEV as (...a: unknown[]) => unknown)(
    type,
    patchProps(type, props),
    key,
    isStatic,
    source,
    self,
  );
}
