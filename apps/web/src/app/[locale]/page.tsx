import { getTrpcServerClient } from "@/api/trpc/proxy/server";
import Container from "@/components/Container";
import type { Segment } from "@/components/hooks/view-segment";
import { Locale } from "@/i18n/routing";
import { Provider } from "jotai";
import Content from "./components/Content";
import HydrateState, { InitialParams } from "./components/HydrateState";
import SearchHero from "./components/SearchHero";

type Props = {
  params: { locale: Locale };
  searchParams: { [key: string]: string };
};

export default async function PageIndex({
  params: { locale },
  searchParams,
}: Props) {
  const params = defaultSearchParams(searchParams);
  const trpc = getTrpcServerClient();
  const data = await trpc.pressRelease.list.query(params);
  const agencies = await trpc.agency.list.query();

  return (
    <Provider>
      <HydrateState
        state={{
          initialParams: params,
          initialData: data,
        }}
      >
        <main className="flex flex-col">
          <SearchHero agencies={agencies} />
          <Container>
            <Content />
          </Container>
        </main>
      </HydrateState>
    </Provider>
  );
}

function defaultSearchParams({
  page,
  limit,
  agencies,
  q,
  view,
  type,
  startDate, // e.g. 2024-09-11
  endDate, // e.g. 2024-09-11
}: Record<string, string>): InitialParams {
  return {
    page: (page && parseInt(page)) || undefined,
    limit: (limit && parseInt(limit)) || undefined,
    agencies: agencies?.split("|"),
    type:
      type === "kenyataan_media" || type === "ucapan" || type === "other"
        ? type
        : undefined,
    query: q,
    view: (view && (view as Segment)) || "card",
    startDate,
    endDate,
  };
}
