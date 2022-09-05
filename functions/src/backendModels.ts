import {
  CreateListRequest,
  MediaDetails,
  MediaType,
  RecommendationList,
} from '../../shared/models';
import { CreateRecommendationListEntity, RecommendedMediaEntity } from './entityModels';

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
  //@JsonAlias("watch/providers")
  //watch_providers: ?StreamResponseDto;
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

}

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
