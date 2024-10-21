import * as cms from "#cms/search";
import { publicProcedure } from "#trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const searchAll = publicProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).default(10),
      q: z.string().default(""),
    })
  )
  .query(async ({ input }) => {
    try {
      return await cms.search(input);
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (e as Error).message,
      });
    }
  });

// export async function listPressReleasesByAgency(
//   agencyId: string,
//   page: number = 1,
//   limit: number = 10,
//   date?: string
// ): Promise<PaginatedResponse<PressRelease>> {
//   try {
//     //have to receive the date params in this format (2024-09-11) YYYY-MM-DD
//     const queryParams = new URLSearchParams({
//       agencyId,
//       page: String(page),
//       page_size: String(limit),
//     });

//     if (date) {
//       queryParams.append("date", date);
//     }

//     const response = await fetch(
//       `${API_URL}/api/press-releases/by-agency?${queryParams.toString()}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${(await getToken()).token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Error fetching press releases by agency: ${response.statusText}`
//       );
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Failed to fetch press releases by agency:", error);
//     throw error;
//   }
// }
