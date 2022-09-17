import { MediaType, RecommendedMedia } from '../../shared/models';

export type CreateRecommendationListEntity = {
  listName: string;
  listDescription: string | null;
  list: RecommendedMediaEntity[];
  createdAt: number;
};

export type RecommendedMediaEntity = RecommendedMedia;
