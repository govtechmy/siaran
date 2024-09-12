export interface Attachment {
    fileUrl: string;
    filename: string;
    filesize: number;
  }
  
export interface Post {
    id: string;
    title: string;
    summary: string;
    content: string;
    title_ms: string;
    summary_ms: string;
    content_ms: string;
    datetime: string; 
    attachments?: Attachment[];
    relatedAgency: string; // agency ID
}

export interface PaginatedResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}