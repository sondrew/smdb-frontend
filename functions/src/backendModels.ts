import {
  CountriesWithWatchProvider,
  CountryWatchProviders,
  MediaType,
  RecommendationList,
  RecommendedMedia,
  WatchProvider,
} from '../../src/shared/models';
import {
  CreateMediaProvidersListEntity,
  CreateRecommendationListEntity,
  RecommendedMediaEntity,
} from './entityModels';
import { CreateListRequest } from '../../src/shared/requestModels';
import { Timestamp } from 'firebase-admin/firestore';

export enum ResponseStatus {
  OK = 'ok',
  ERROR = 'error',
}

export type ApiResponse<T> = ResponseSuccess<T> | ResponseError;

export type ResponseSuccess<T> = {
  status: ResponseStatus.OK;
  data: T;
};

export type ResponseError = {
  status: ResponseStatus.ERROR;
  data: ResponseErrorData;
};

export type ResponseErrorData = {
  input: string | number;
  statusCode: number;
  request: string;
};

export type TMDbMultiSearchDto = {
  total_results: number;
  total_pages: number;
  page: number;
  results: Array<MovieSearchResultDto | TVSearchResultDto | PersonSearchResultDto>;
};

export type MovieSearchResultDto = {
  id: number;
  media_type: MediaType.MOVIE;
  title?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  video?: boolean;
  popularity: number;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  original_title?: string;
  original_language: string;
  release_date?: string;
  adult: boolean;
  genre_ids: number[];
};

export type TVSearchResultDto = {
  id: number;
  media_type: MediaType.TV;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  video?: boolean;
  popularity: number;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  original_name?: string;
  origin_country?: string[];
  original_language: string;
  first_air_date?: string;
  adult: boolean;
  genre_ids: number[];
};

export type PersonSearchResultDto = {
  id: number;
  media_type: MediaType.PERSON;
  name?: string;
  profile_path: string | null;
  adult?: boolean;
  popularity?: number;
  known_for: Array<MovieSearchResultDto | TVSearchResultDto>;
};

export type TVDetailsDto = {
  id: number;
  name: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  original_name: string;
  in_production: Boolean;
  genres: GenreDto[];
  status: string;
  tagline: string;
  external_ids?: ExternalIdsDto;
  'watch/providers'?: WatchProviders;
};

export type MovieDetailsDto = {
  id: number;
  title: string;
  original_title: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  overview: string;
  poster_path: string;
  release_date: string;
  tagline?: string;
  genres: GenreDto[];
  video: Boolean;
  imdb_id?: string;
  'watch/providers'?: WatchProviders;
};

export interface WatchProviders {
  results: { [key: string]: StreamingCountryDetailsDto };
}

export type StreamingCountryDetailsDto = {
  link?: string;
  flatrate?: StreamingOptionDto[];
  rent?: StreamingOptionDto[];
  buy?: StreamingOptionDto[];
};

export type StreamingOptionDto = {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
};

export type ExternalIdsDto = {
  imdb_id?: string;
  facebook_id?: string;
  instagram_id?: string;
  twitter_id?: string;
};

export type GenreDto = {
  id: number;
  name: string;
};

export type StreamingDetailsDto = {
  results?: Map<string, StreamingCountryDetailsDto>;
};

export class MovieAndTVShowDetailsResponse {
  movieResponses: MultipleMediaDetailResponses<MovieDetailsDto>;
  tvShowResponses: MultipleMediaDetailResponses<TVDetailsDto>;

  constructor(
    movies: MultipleMediaDetailResponses<MovieDetailsDto>,
    tvShows: MultipleMediaDetailResponses<TVDetailsDto>
  ) {
    this.movieResponses = movies;
    this.tvShowResponses = tvShows;
  }

  toCreateRecommendationListEntity(createList: CreateListRequest): CreateRecommendationListEntity {
    console.log('toCreateRecommendationListEntity');
    console.log('createList', createList);
    const movies = this.movieResponses.getMediaData().map((movie) => {
      const userInput = createList.list.find((item) => item.tmdbId === movie.id)!;
      console.log('movie title', movie.title);
      return {
        id: movie.id,
        listIndex: userInput.index,
        userRating: userInput.userRating,
        userComment: userInput.userComment,
        title: movie.title,
        originalTitle: movie.original_title,
        description: movie.overview,
        mediaType: MediaType.MOVIE,
        posterPath: movie.poster_path ?? null,
        imdbPath: movie.imdb_id ?? null,
        genres: movie.genres.map((genre) => genre.name),
      } as RecommendedMediaEntity;
    });
    const tvShows = this.tvShowResponses.getMediaData().map((tvShow) => {
      const userInput = createList.list.find((item) => item.tmdbId === tvShow.id)!;
      console.log('tv title', tvShow.name);
      return {
        id: tvShow.id,
        listIndex: userInput.index,
        userRating: userInput.userRating ?? null,
        userComment: userInput.userComment ?? null,
        title: tvShow.name,
        originalTitle: tvShow.original_name,
        description: tvShow.overview,
        mediaType: MediaType.TV,
        posterPath: tvShow.poster_path ?? null,
        imdbPath: tvShow?.external_ids?.imdb_id ?? null,
        genres: tvShow.genres.length === 0 ? null : tvShow.genres.map((genre) => genre.name),
      } as RecommendedMediaEntity;
    });

    return {
      listName: createList.listName,
      listDescription: createList.listDescription,
      list: movies.concat(tvShows),
      createdAt: Date.now(),
    };
  }

  static toRecommendationList(
    createList: CreateRecommendationListEntity,
    listId: string
  ): RecommendationList {
    return {
      id: listId,
      listName: createList.listName,
      listDescription: createList.listDescription,
      list: this.toListWithFullPosterUrl(createList.list),
    } as RecommendationList;
  }

  static toListWithFullPosterUrl(list: RecommendedMedia[]): RecommendedMedia[] {
    return list.map(
      (media: RecommendedMedia) =>
        ({
          ...media,
          posterPath: getPosterUrl(media.posterPath),
          countriesWithProviders: null,
        } as RecommendedMedia)
    );
  }
}

const mapMediaDetailsToWatchProviders = (
  media: ResponseSuccess<MovieDetailsDto | TVDetailsDto>
): CountriesWithWatchProvider => {
  const createCountryProvidersModel = (media: {
    [countryCode: string]: StreamingCountryDetailsDto;
  }): CountriesWithWatchProvider => {
    const countryCodes = Object.keys(media);
    const countryProviderMap: { [countryCode: string]: CountryWatchProviders } = {};

    countryCodes.forEach((countryCode) => {
      const countryProviders = media[countryCode];
      countryProviderMap[countryCode] = {
        link: countryProviders?.link ?? null,
        flatrate: streamingOptionDtoToEntity(countryProviders?.flatrate),
        rent: streamingOptionDtoToEntity(countryProviders?.rent),
        buy: streamingOptionDtoToEntity(countryProviders?.buy),
      };
    });

    return countryProviderMap;
  };

  const streamingOptionDtoToEntity = (countries?: StreamingOptionDto[]): WatchProvider[] => {
    if (!countries || countries.length === 0) return [];
    return countries.map((country: StreamingOptionDto) => ({
      displayPriority: country.display_priority,
      logoPath: country.logo_path,
      providerId: country.provider_id,
      providerName: country.provider_name,
    }));
  };

  const countries = media.data['watch/providers']?.results;

  return !!countries ? createCountryProvidersModel(countries) : null;
};

const mapFromWatchProvidersDtoToDomain = (moviesAndShows: MovieAndTVShowDetailsResponse) => {
  const mapMediaDetailsToProviderList = (
    mediaItems: ResponseSuccess<MovieDetailsDto | TVDetailsDto>[]
  ): CreateMediaProvidersListEntity[] => {
    return mediaItems.map((mediaItem: ResponseSuccess<MovieDetailsDto | TVDetailsDto>) => {
      const countries = mediaItem.data['watch/providers']?.results;
      const providers: CreateMediaProvidersListEntity = {
        id: String(mediaItem.data.id),
        lastUpdated: Timestamp.now(),
        countries: null, //!!countries ? ceateCountryProvidersModel(countries) : null, // set to null for media items without providers
      };
      return providers;
    });
  };

  /*
  Currently I've chosen to store all movies/tv shows even though they don't have known watch providers
  Will take new look at best way of storing/retrieving when making functionality to get providers
  in the frontend for the whole list and ways of dealing with movies/shows that has no providers

  const moviesWithProviders = moviesAndShows.movieResponses.data.filter(
    (movie: ResponseSuccess<MovieDetailsDto>) => !!movie.data['watch/providers']?.results
  );

  const tvShowsWithProviders = moviesAndShows.tvShowResponses.data.filter(
    (tvShow: ResponseSuccess<TVDetailsDto>) => !!tvShow.data['watch/providers']?.results
  );
   */

  const movieProviders = mapMediaDetailsToProviderList(moviesAndShows.movieResponses.data);
  const tvShowProviders = mapMediaDetailsToProviderList(moviesAndShows.tvShowResponses.data);
};

const FALLBACK_POST_URL =
  'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const getPosterUrl = (path: string | null): string => {
  console.log('posterPath', path);
  if (path !== null) return `${POSTER_BASE_URL}${path}`;
  else return FALLBACK_POST_URL;
};

export class MultipleMediaDetailResponses<T> {
  status: ResponseStatus;
  data: ResponseSuccess<T>[];
  error: any | null;

  constructor(responses: ApiResponse<T>[], error?: ResponseErrorData) {
    this.status = !!error ? ResponseStatus.ERROR : ResponseStatus.OK;
    this.data = responses.filter(
      (media): media is ResponseSuccess<T> => media.status === ResponseStatus.OK
    );
    this.error = !!error ? error : null;
  }

  getMediaData(): T[] {
    return this.data.map((media) => media.data);
  }

  static returnEmptyResponse<T>(): MultipleMediaDetailResponses<T> {
    return new MultipleMediaDetailResponses<T>([]);
  }
}

export const isTVShow = (
  media: MovieSearchResultDto | TVSearchResultDto | PersonSearchResultDto
): media is TVSearchResultDto => media.media_type === MediaType.TV;
export const isMovie = (
  media: MovieSearchResultDto | TVSearchResultDto | PersonSearchResultDto
): media is MovieSearchResultDto => media.media_type === MediaType.MOVIE;

export const isBoth = (
  media: MovieSearchResultDto | TVSearchResultDto | PersonSearchResultDto
): media is MovieSearchResultDto | TVSearchResultDto =>
  media.media_type === MediaType.MOVIE || media.media_type === MediaType.TV;

// todo: move this to own file domainModels and rename current to tmdbResponseModels
export interface MediaIdsOfTypes {
  movies: number[];
  shows: number[];
}
