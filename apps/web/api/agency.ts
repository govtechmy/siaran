"use server"
import type { Agency } from "@/app/types/types";
import { getToken } from "./press-release";

const API_URL = process.env.API_URL || process.env.STAGING_CMS_URL;

export const listAgencies = async (): Promise<Agency[]> => {
    try {
      const response = await fetch(`${API_URL}/api/agencies?limit=0`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await getToken()).token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching agencies: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.docs;
    } catch (error) {
      console.error("Failed to fetch agencies:", error);
      throw error;
    }
};
