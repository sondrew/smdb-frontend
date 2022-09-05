import { MediaType, RecommendedMedia } from '../../shared/models';

export type CreateRecommendationListEntity = {
  listName: string;
  listDescription: string | null;
  list: RecommendedMediaEntity[];
};

export type RecommendedMediaEntity = RecommendedMedia;
