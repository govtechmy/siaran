import type { ListPressReleaseParams } from "@/api/hooks/query";
import { trpc } from "@/api/trpc/proxy/server";
import Container from "@/components/Container";
import SearchHero from "@/components/SearchHero";
import { Locale } from "@/i18n/routing";
import { getPageMetadata, MetadataProps } from "@/lib/page/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Content from "./components/Content";

type Props = {
  params: { locale: Locale };
  searchParams: { [key: string]: string };
};

export async function generateMetadata({
  params: { locale },
}: MetadataProps): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return getPageMetadata({
    title: t("metadata.site.title"),
    description: t("metadata.site.description"),
    imageUrl: t("metadata.site.openGraph.images.1.url"),
    siteName: t("app.name"),
  });
}

export default async function PageIndex({
  params: { locale },
  searchParams,
}: Props) {
  const params = defaultSearchParams(searchParams);
  const data = await trpc.pressRelease.list.query(params);
  const agencies = await trpc.agency.list.query();

  return (
    <main className="flex flex-col">
      <SearchHero locale={locale} agencies={agencies} />
      <Container>
        <Content initialParams={params} initialData={data} />
      </Container>
    </main>
  );
}

function defaultSearchParams({
  page,
  limit,
  agencies,
  q,
  type,
  startDate, // e.g. 2024-09-11
  endDate, // e.g. 2024-09-11
}: Record<string, string>): ListPressReleaseParams {
  return {
    page: (page && parseInt(page)) || undefined,
    limit: (limit && parseInt(limit)) || undefined,
    agencies: agencies?.split("|"),
    type:
      type === "kenyataan_media" || type === "ucapan" || type === "other"
        ? type
        : undefined,
    query: q,
    startDate,
    endDate,
  };
}
