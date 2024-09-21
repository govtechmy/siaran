import { Post, PaginatedResponse } from '../src/app/types/types';

const API_URL = process.env.API_URL;
const TOKEN = process.env.TOKEN;

export const getPosts = async (page: number = 1, limit: number = 12, date?: string): Promise<PaginatedResponse<Post>> => {
  try { //have to receive the date params in this format (2024-09-11) YYYY-MM-DD
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (date) {
      queryParams.append('date', date); 
    }

    const response = await fetch(`${API_URL}/api/press-releases?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
};

export const getPostsByAgency = async (agencyId: string, page: number = 1, limit: number = 10, date?: string): Promise<PaginatedResponse<Post>> => {
  try { //have to receive the date params in this format (2024-09-11) YYYY-MM-DD
    const queryParams = new URLSearchParams({
      agencyId,
      page: String(page),
      limit: String(limit),
    });

    if (date) {
      queryParams.append('date', date);
    }

    const response = await fetch(`${API_URL}/api/press-releases/by-agency?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`, // Add Bearer token here
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching posts by agency: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch posts by agency:', error);
    throw error;
  }
};
