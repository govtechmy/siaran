import { getTrpcServerClient } from "@/api/trpc/proxy/server";
import Container from "@/components/Container";
import { Locale } from "@/i18n/routing";
import { getPageMetadata } from "@/lib/page/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Content from "./components/Content";
import HydrateState from "./components/HydrateState";

type Props = {
  params: { locale: Locale; id: string };
  searchParams: { [key: string]: string };
};

export async function generateMetadata({
  params: { locale, id },
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

export default async function PagePressReleases({
  params: { locale, id },
  searchParams,
}: Props) {
  const trpc = getTrpcServerClient();
  const data = await trpc.pressRelease.getById.query({ id });

  return (
    <HydrateState state={{ initialData: data, initialParams: { id } }}>
      <main className="flex flex-col">
        <Container className="py-0">
          <Content />
        </Container>
      </main>
    </HydrateState>
  );
}
