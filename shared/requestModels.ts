import { MediaType } from './models';

export interface CreateListRequest {
  listName: string;
  listDescription: string | null;
  list: CreateListItemRequest[];
}

export interface CreateListItemRequest {
  tmdbId: number;
  index: number;
  mediaType: MediaType;
  userComment?: string;
  userRating?: number | null;
}
