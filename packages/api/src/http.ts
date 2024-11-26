import { logger } from "#logging/logger";
import { colors } from "consola/utils";
import { type $Fetch, ofetch, FetchError as OFetchError } from "ofetch";

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
    async onResponseError(res) {
      if (process.env.NODE_ENV === "development") {
        logger.error(
          colors.bgRed(`CMS error:\n`) +
            `${JSON.stringify(
              {
                request: res.request,
                response: res.response,
              },
              null,
              2,
            )}`,
        );
      } else {
        logger.error(
          JSON.stringify(
            {
              type: "CMS_ERROR",
              method: res.options.method,
              request: res.request,
              response: res.response,
            },
            null,
            2,
          ),
        );
      }
    },
    async onResponse(res) {
      if (process.env.NODE_ENV === "development") {
        logger.info(
          colors.magenta(
            `CMS response: [${res.options.method}] ${res.response.url} ${res.response.status}`,
          ),
        );
      } else {
        logger.info(
          JSON.stringify(
            {
              type: "CMS_RESPONSE",
              method: res.options.method,
              url: res.response.url,
              status: res.response.status,
            },
            null,
            2,
          ),
        );
      }
    },
  });
}

export const CMSFetchError = OFetchError;
