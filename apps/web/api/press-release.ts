"use server"
import type { PressRelease, PaginatedResponse, SearchResponse } from "@/app/types/types";

const API_URL = process.env.API_URL || process.env.STAGING_CMS_URL;

export async function getToken(): Promise<{ token: string }> {
  const response = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: process.env.STAGING_PAYLOAD_LOGIN_EMAIL,
      password: process.env.STAGING_PAYLOAD_LOGIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to login to CMS");
  }

  return {
    token: (await response.json())["token"],
  };
}

export const listPressReleases = async (
  page: number = 1,
  limit: number = 10,
  date?: string
): Promise<PaginatedResponse<PressRelease>> => {
  try {
    // Format: YYYY-MM-DD (e.g. 2024-09-11)
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (date) {
      queryParams.append("date", date);
    }

    const response = await fetch(
      `${API_URL}/api/press-releases?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await getToken()).token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching press releases: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch press releases:", error);
    throw error;
  }
};

export async function listPressReleasesByAgency(
  agencyId: string,
  page: number = 1,
  limit: number = 10,
  date?: string
): Promise<PaginatedResponse<PressRelease>> {
  try {
    //have to receive the date params in this format (2024-09-11) YYYY-MM-DD
    const queryParams = new URLSearchParams({
      agencyId,
      page: String(page),
      page_size: String(limit),
    });

    if (date) {
      queryParams.append("date", date);
    }

    const response = await fetch(
      `${API_URL}/api/press-releases/by-agency?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await getToken()).token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching press releases by agency: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch press releases by agency:", error);
    throw error;
  }
}

export async function searchContent(
  query: string,
  limit: number = 5,
  page: number = 1
): Promise<SearchResponse> {
  try {
    const { token } = await getToken();

    const queryParams = new URLSearchParams({
      q: query,
      limit: String(limit),
      page: String(page),
    });

    const response = await fetch(`${API_URL}/api/search?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error searching content: ${response.statusText}`);
    }

    const data = await response.json();

    return data 
  } catch (error) {
    console.error('Failed to search content:', error);
    throw error;
  }
}

