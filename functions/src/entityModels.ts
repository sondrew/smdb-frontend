import { RecommendedMedia } from '../../shared/models';
import { Timestamp } from 'firebase-admin/firestore';

export type CreateRecommendationListEntity = {
  listName: string;
  listDescription: string | null;
  list: RecommendedMediaEntity[];
  createdAt: number;
};

export type RecommendedMediaEntity = RecommendedMedia;

export type CreateMediaProvidersListEntity = {
  id: string;
  lastUpdated: Timestamp;
  countries: { [countryCode: string]: CountryProvidersEntity } | null;
};

export type CountryProvidersEntity = {
  link: string | null;
  flatrate: StreamingOptionEntity[];
  rent: StreamingOptionEntity[];
  buy: StreamingOptionEntity[];
};

export type StreamingOptionEntity = {
  displayPriority: number;
  logoPath: string;
  providerId: number;
  providerName: string;
};
