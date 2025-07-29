import { CreateMediaProvidersListEntity } from '../../functions/src/entityModels';

export enum MediaType {
  TV = 'tv',
  MOVIE = 'movie',
  PERSON = 'person',
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
  releaseDate: string | null;
  originalTitle: string;
}

export class RecommendationListWithProviders {
  id: string;
  listName: string;
  listDescription: string | null;
  list: RecommendedMedia[];

  constructor(
    recommendations: RecommendationList,
    movieProviders: CreateMediaProvidersListEntity[],
    tvShowProvider: CreateMediaProvidersListEntity[]
  ) {
    console.log('CONSTRUCTOR');
    this.id = recommendations.id;
    this.listName = recommendations.listName;
    this.listDescription = recommendations.listDescription;
    this.list = RecommendationListWithProviders.mergeRecommendationsWithProvider(
      recommendations.list,
      movieProviders,
      tvShowProvider
    );
  }

  static mergeRecommendationsWithProvider = (
    list: RecommendedMedia[],
    movieProviders: CreateMediaProvidersListEntity[],
    tvShowProviders: CreateMediaProvidersListEntity[]
  ): RecommendedMedia[] => {
    const movies = list.filter((item: RecommendedMedia) => item.mediaType === 'movie');
    const tvShows = list.filter((item: RecommendedMedia) => item.mediaType === 'tv');

    console.log('TV SHOWS');
    const newShows: RecommendedMedia[] = tvShows.map((item: RecommendedMedia): RecommendedMedia => {
      console.log('show', item);
      const countries =
        tvShowProviders.find(
          (providers: CreateMediaProvidersListEntity) => providers.id === `${item.id}`
        ) ?? null;
      console.log('matching provider', countries);
      return {
        ...item,
        countriesWithProviders: countries?.countries ?? null,
      };
    });

    console.log('MOVIES');
    const newMovies: RecommendedMedia[] = movies.map((item: RecommendedMedia) => {
      console.log('show', item);
      const countries =
        movieProviders.find(
          (providers: CreateMediaProvidersListEntity) => providers.id === `${item.id}`
        ) ?? null;
      console.log('matching provider', countries);
      return {
        ...item,
        countriesWithProviders: countries?.countries ?? null,
      };
    });

    return newShows.concat(newMovies);
  };
}

export type RecommendationList = {
  id: string;
  listName: string;
  listDescription: string | null;
  list: RecommendedMedia[];
};

export type RecommendedMedia = {
  id: number;
  listIndex: number;
  userRating: number | null;
  userComment: string | null;
  title: string;
  originalTitle: string | null;
  description: string | null;
  mediaType: MediaType;
  posterPath: string | null;
  imdbPath: string | null;
  genres: string[];
  countriesWithProviders: CountriesWithWatchProvider | null;
};

export type CountriesWithWatchProvider = {
  [countryCode: string]: CountryWatchProviders;
} | null;

export type CountryWatchProviders = {
  link: string | null;
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
};

export type WatchProvider = {
  displayPriority: number;
  logoPath: string;
  providerId: number;
  providerName: string;
};
