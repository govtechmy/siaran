import { colors } from "consola/utils";
import { $Fetch, ofetch, FetchError as OFetchError } from "ofetch";

export let client: $Fetch | null = null;

export async function cmsFetch<T>(
  ...args: Parameters<typeof ofetch<T>>
): Promise<ReturnType<typeof ofetch<T>>> {
  if (!client) {
    client = ofetch.create({
      baseURL: process.env.CMS_PAYLOAD_URL,
    });
  }

  return client<T>(args[0], {
    ...args[1],
    async onResponse(res) {
      console.info(
        colors.magentaBright(
          `CMS request: [${res.options.method}] ${res.response.url} ${res.response.status}`
        )
      );
    },
  });
}

export const CMSFetchError = OFetchError;
