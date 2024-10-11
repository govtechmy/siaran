export type Attachment = {
  url: string;
  alt: string;
  // TODO: Rename
  file_name: string;
  file_type: string;
  file_size: number;
};

export type Content = {
  plain: string;
  html: string;
  markdown: string;
};

export type Agency = {
  id: string;
  name: string;
  acronym: string;
  email: string;
  socialMedia: string[];
};

export type PressRelease = {
  id: string;
  language: string;
  title: string;
  date_published: string;
  type: PressReleaseType;
  content: Content;
  attachments?: Attachment[];
  relatedAgency: Agency;
};

export type PressReleaseType = "kenyataan_media" | "ucapan" | "other";

export type PaginatedResponse<T> = {
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
};

export type SearchResponse = {
  pressReleases: PressRelease[];
  agencies: Agency[];
};