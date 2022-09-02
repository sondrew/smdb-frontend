import {MediaType} from "../../shared/models";

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

export interface RecommendationList {
  id: string;
  listName: string;
  listDescription?: string;
  list: RecommendedMedia[];
}

//@Document - maybe not needed when already inside RecommendationList?
export interface RecommendedMedia {
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
