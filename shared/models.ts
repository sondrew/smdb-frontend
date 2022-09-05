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

export type RecommendationList = {
  id: string;
  listName: string;
  listDescription: string | null;
  list: RecommendedMedia[];
};

export type RecommendedMedia = {
  id: number;
  listIndex: number;
  userRating: number | null;
  userComment: string | null;
  title: string;
  originalTitle: string | null;
  description: string | null;
  mediaType: MediaType;
  posterPath: string | null;
  imdbPath: string | null;
  genres: string[];
};
