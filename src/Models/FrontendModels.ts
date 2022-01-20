import { MediaType } from './BackendModels';

export interface RecommendedItem {
  id: number;
  //index: number;
  mediaType: MediaType;
  title: string;
  releaseDate: string;
  posterUrl?: string;
  userComment?: string;
  userRating?: number | null;
}

export interface RecommendationListDetails {
  title: string;
  description?: string;
}
