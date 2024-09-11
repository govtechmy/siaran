import { Post, PaginatedResponse }from '../src/app/types/types'
const API_URL = process.env.API_URL;


export const getPosts = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> => {
    try {
        const response = await fetch(`${API_URL}/api/press-releases?page=${page}&page_size=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
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

export const getPostsByAgency = async (agencyId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> => {
    try {
      const response = await fetch(`${API_URL}/api/press-releases/by-agency?agencyId=${agencyId}&page=${page}&page_size=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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