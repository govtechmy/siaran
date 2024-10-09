export type Attachment = {
  url: string;
  alt: string;
  // TODO: use consistent naming convention (e.g. fileName instead of file_name)
  file_name: string;
  file_type: string;
  file_size: number;
};

export type Content = {
  plain: string;
  html: string;
  markdown: string;
};

export type RelatedAgency = {
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
  relatedAgency: RelatedAgency;
};

export type PressReleaseType = "kenyataan_media" | "ucapan" | "other";

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponseFields = {
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  totalDocs: number;
};

export type PaginatedResponse<T> = PaginatedResponseFields & {
  docs: T[];
};

export type PaginatedSearchResponse = PaginatedResponseFields & {
  pressReleases: PressRelease[];
  agencies: RelatedAgency[];
};

export type Locale = "en-MY" | "ms-MY";
export type CMSLocale = "en" | "ms";
