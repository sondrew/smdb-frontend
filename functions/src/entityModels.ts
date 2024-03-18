import {
  CountriesWithWatchProvider,
  RecommendationList,
  RecommendedMedia,
} from '../../shared/models';
import { Timestamp } from 'firebase-admin/firestore';

export type CreateRecommendationListEntity = {
  listName: string;
  listDescription: string | null;
  list: RecommendedMediaEntity[];
  createdAt: number;
};

export type RecommendedMediaEntity = RecommendedMedia;

const recommendedMediaToEntity = (domain: RecommendedMedia): RecommendedMediaEntity =>
  domain as RecommendedMediaEntity;

export type CreateMediaProvidersListEntity = {
  id: string;
  lastUpdated: Timestamp;
  countries: CountriesWithWatchProvider;
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
