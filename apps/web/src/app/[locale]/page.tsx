import Content from "@/components/__pages__/Content";
import Section from "@/components/Section";
import { getPageMetadata, MetadataProps } from "@/lib/page/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { listPressReleases } from "../../../api/press-release";

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
  const currentPage = parseInt(props.searchParams.page) || 1;
  const response = await listPressReleases(currentPage, 12);

  return (
    <main className="flex flex-col">
      <Section>
        <Content response={response} />
      </Section>
    </main>
  );
}
