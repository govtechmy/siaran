export interface Attachment {
    url: string;
    alt: string;
    file_name: string;
    file_type: string;
    file_size: number;
}
  
export interface Content {
    plain: string;
    html: string;
    markdown: string;
}
  
export interface RelatedAgency {
    id: string;
    name: string;
    acronym: string;
    email: string;
    socialMedia: string[];  
}
  
export interface Post {
    id: string;
    language: string;
    title: string;
    date_published: string;  
    type: string;
    content: Content;  
    attachments?: Attachment[];  
    relatedAgency: RelatedAgency;
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