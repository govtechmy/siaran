import {
  DependencyList,
  EffectCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function useMountedState() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(function onMount() {
    setIsMounted(true);
  }, []);

  return isMounted;
}

function useMountedRef() {
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
  const isMounted = useMountedRef();

  useEffect(function skipCallbackBeforeMounted() {
    if (!isMounted) {
      return;
    }

    return callback();
  }, dependencyList);
}
