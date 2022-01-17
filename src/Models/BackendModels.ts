export interface TMDbMovie {
  id: number;
  title: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  overview: string;
  posterUrl: string;
  releaseDate: string;
  markedFavourite: boolean;
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
  releaseDate: string;
  originalTitle: string;
}

enum MediaType {
  movie,
  tv,
}
