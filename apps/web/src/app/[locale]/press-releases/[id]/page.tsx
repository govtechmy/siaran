import { getTrpcServerClient } from "@/api/trpc/proxy/server";
import Container from "@/components/Container";
import { Locale } from "@/i18n/routing";
import { PressRelease } from "@repo/api/cms/schema/press-release";
import { notFound } from "next/navigation";
import Content from "./components/Content";
import HydrateState from "./components/HydrateState";

type Props = {
  params: { locale: Locale; id: string };
};

export default async function PagePressReleases({
  params: { locale, id },
}: Props) {
  const trpc = getTrpcServerClient();

  let data: PressRelease;

  try {
    data = await trpc.pressRelease.getById.query({ id });
  } catch (e) {
    if (e instanceof Error && e.message === "not_found") {
      notFound();
    }

    return;
  }

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
