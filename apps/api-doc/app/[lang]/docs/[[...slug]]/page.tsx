// @ts-nocheck - TODO: remove this after MYDS upgrades to React 19

import { source } from "@/lib/source";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

type Props = { slug?: string[]; lang: string };

async function getPageOrNotFound({ params }: { params: Promise<Props> }) {
  const { slug, lang } = await params;
  const page = source.getPage(slug, lang);

  if (!page) notFound();
  return page;
}

export default async function Page({
  params,
}: {
  params: Promise<Props>;
}): Promise<ReactNode> {
  const { slug, lang } = await params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} data-pagefind-body>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: { params: Promise<Props> }) {
  const { slug, lang } = await params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
