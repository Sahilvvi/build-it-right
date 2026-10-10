import { useSyncExternalStore } from "react";

/**
 * A counter that remounts the page when the site editor changes something, so pages that do not
 * subscribe to the store (most of the static copy) re-render with the new text.
 */
let epoch = 0;
const subscribers = new Set<() => void>();

export function bumpPageEpoch() {
  epoch++;
  subscribers.forEach((fn) => fn());
}

export function usePageEpoch(): number {
  return useSyncExternalStore(
    (cb) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
    () => epoch,
    () => 0,
  );
}

/** Set by the admin "Open site editor" button; the toolbar opens the editor once on arrival. */
let openOnArrival = false;
export const requestEditorOpen = () => {
  openOnArrival = true;
};
export const consumeEditorOpenRequest = () => {
  const v = openOnArrival;
  openOnArrival = false;
  return v;
};
