import { getPageMetadata, MetadataProps } from "@/lib/page/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PaginatedResponse, Post } from "../types/types";
import PostsBox from "@/components/PostsBox";
import { getPosts } from "../../../actions/apiServices";

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

export default async function PageIndex() {
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
  );
}

interface MainPageProps {
  searchParams: { [key: string]: string };
}

async function MainPage({ searchParams }: MainPageProps) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  const paginatedPosts: PaginatedResponse<Post> = await getPosts(
    currentPage,
    12
  );

  return (
    <div>
      <PostsBox posts={paginatedPosts} />
    </div>
  );
}
