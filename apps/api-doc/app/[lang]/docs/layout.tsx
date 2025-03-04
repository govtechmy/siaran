// @ts-nocheck - TODO: remove this after MYDS upgrades to React 19

import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

type Props = {
  params: { lang: string };
};

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<Props["params"]>;
}) {
  return (
    <DocsLayout
      sidebar={{
        hideSearch: true,
      }}
      nav={{
        enableSearch: false,
      }}
      tree={source.pageTree[(await params).lang]}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
