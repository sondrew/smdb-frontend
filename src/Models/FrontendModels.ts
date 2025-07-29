import { MediaType } from '../shared/models';

export interface RecommendedItem {
  id: number;
  //index: number;
  mediaType: MediaType;
  title: string;
  releaseDate: string | null;
  posterUrl: string;
  userComment: string;
  userRating: number | null;
}
