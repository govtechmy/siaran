"use client";

import { useMountedState } from "./hooks/mounted";

type Props = {
  children: React.ReactNode;
};

export default function ClientOnly({ children }: Props) {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }

  return children;
}
