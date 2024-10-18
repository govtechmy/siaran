import { trpc } from "@/api/trpc/proxy/server";
import Container from "@/components/Container";
import { getPageMetadata, MetadataProps } from "@/lib/page/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Content from "./components/Content";

type Props = {
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

export default async function PageIndex(props: Props) {
  const data = await trpc.pressRelease.list.query({
    page: parseInt(props.searchParams.page) || 1,
  });

  return (
    <main className="flex flex-col">
      <Container>
        <Content initialData={data} />
      </Container>
    </main>
  );
}
