import { DependencyList, EffectCallback, useEffect, useRef } from "react";

function useMounted() {
  const isMounted = useRef(false);

  useEffect(function onMount() {
    isMounted.current = true;
  }, []);

  return isMounted.current;
}

export function useEffectMounted(
  callback: EffectCallback,
  dependencyList: DependencyList,
) {
  const isMounted = useMounted();

  useEffect(function skipCallbackBeforeMounted() {
    if (!isMounted) {
      return;
    }

    return callback();
  }, dependencyList);
}
