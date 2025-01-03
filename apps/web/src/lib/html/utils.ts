import { RefObject } from "react";

/**
 * A util function to check if a target is inside a set of refs
 *
 * Sample usage: inInside([ref1, ref2], container)
 */
export function isInside<T extends HTMLElement>(
  refs: RefObject<T>[],
  target: EventTarget | null,
) {
  return refs.some(
    (ref) =>
      ref.current && target instanceof Node && ref.current.contains(target),
  );
}
