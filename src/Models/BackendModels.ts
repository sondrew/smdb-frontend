import { int } from 'framer-motion/types/render/dom/value-types/type-int';

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
  posterUrl?: string;
  releaseDate: string;
  originalTitle: string;
}

export enum MediaType {
  movie,
  tv,
}

export interface ViewRecommendationList {
  id: string;
  listName: string;
  listDescription?: string;
  list: ViewRecommendedMediaView[];
}

//@Document - maybe not needed when already inside RecommendationList?
export interface ViewRecommendedMediaView {
  id: number;
  listIndex: number;
  userRating?: number;
  userComment?: string;
  title: string;
  originalTitle?: string;
  description?: string;
  mediaType: MediaType;
  posterPath?: string; // get from backend
  imdbPath?: string;
  genres: string[];
}
