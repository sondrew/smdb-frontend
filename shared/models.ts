export enum MediaType {
  TV = 'tv',
  MOVIE = 'movie',
  PERSON = 'person',
}

export interface SearchItem {
  id: number;
  title: string;
  mediaType: MediaType;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  overview: string;
  posterUrl: string;
  releaseDate: string | null;
  originalTitle: string;
}

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

