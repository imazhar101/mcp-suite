import { CanvasEntity } from "./index.js";

export interface Page extends CanvasEntity {
  page_id: number;
  url: string;
  title: string;
  hide_from_students?: boolean;
  editing_roles?: string;
  last_edited_by?: any;
  body?: string;
  published: boolean;
  publish_at?: string;
  front_page: boolean;
  locked_for_user?: boolean;
  lock_info?: any;
  lock_explanation?: string;
  editor?: "rce" | "block_editor";
  block_editor_attributes?: {
    id: number;
    version: string;
    blocks: string;
  };
}

export interface PageRevision {
  revision_id: number;
  updated_at: string;
  latest: boolean;
  edited_by?: any;
  url?: string;
  title?: string;
  body?: string;
}

export interface PageListParams {
  sort?: "title" | "created_at" | "updated_at";
  order?: "asc" | "desc";
  search_term?: string;
  published?: boolean;
  include?: "body"[];
}

export interface PageCreateParams {
  title: string;
  body?: string;
  editing_roles?: "teachers" | "students" | "members" | "public" | string;
  notify_of_update?: boolean;
  published?: boolean;
  front_page?: boolean;
  publish_at?: string;
}

export interface PageUpdateParams {
  title?: string;
  body?: string;
  editing_roles?: "teachers" | "students" | "members" | "public" | string;
  notify_of_update?: boolean;
  published?: boolean;
  front_page?: boolean;
  publish_at?: string;
}

export interface PageRevisionParams {
  summary?: boolean;
}

export interface PageRevertParams {
  revision_id: number;
}
