import type { ListPressReleaseParams } from "@/api/hooks/query";
import { getTrpcServerClient } from "@/api/trpc/proxy/server";
import Container from "@/components/Container";
import { Locale } from "@/i18n/routing";
import { getPageMetadata } from "@/lib/page/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Content from "./components/Content";
import HydrateState from "./components/HydrateState";
import SearchHero from "./components/SearchHero";
import ClientOnly from "@/components/ClientOnly";

type Props = {
  params: { locale: Locale };
  searchParams: { [key: string]: string };
};

export async function generateMetadata({
  params: { locale },
}: {
  params: Props["params"];
}): Promise<Metadata> {
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
  const trpc = getTrpcServerClient();
  const data = await trpc.pressRelease.list.query(params);
  const agencies = await trpc.agency.list.query();

  return (
    <HydrateState
      state={{
        initialParams: params,
        initialData: data,
      }}
    >
      <main className="flex flex-col">
        <SearchHero agencies={agencies} />
        <Container>
          <ClientOnly>
            <Content />
          </ClientOnly>
        </Container>
      </main>
    </HydrateState>
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
