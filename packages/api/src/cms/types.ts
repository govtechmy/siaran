// TODO: remove
import { type Agency as _Agency } from "#cms/schema/agency";
import { type User as _User } from "#cms/schema/user";
import {
  type Content as _Content,
  type Attachment as _Attachment,
  type PressRelease as _PressRelease,
  type Type as _Type,
} from "#cms/schema/press-release";

export type Attachment = _Attachment;
export type Content = _Content;
export type Agency = _Agency;
export type User = _User;
export type PressRelease = _PressRelease;
export type PressReleaseType = _Type;

export type Sort = {
  pressReleases: "asc" | "desc";
};

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
  agencies: Agency[];
};

export type Locale = "en-MY" | "ms-MY";
export type CMSLocale = "en" | "ms";
