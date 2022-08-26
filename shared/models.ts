export enum MediaType {
  TV = 'tv',
  MOVIE = 'movie'
}

export interface SearchItem {
  id: number;
  title: string;
  mediaType: MediaType;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  overview: string;
  posterUrl?: string;
  releaseDate: string;
  originalTitle: string;
}
