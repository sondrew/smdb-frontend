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
