import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Metadata } from "next";
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
export const metadata: Metadata = {
  title: {
    template: "%s | Siaran API",
    default: "Webhooks",
  },
};
