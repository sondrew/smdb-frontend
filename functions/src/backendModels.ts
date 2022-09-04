import { MediaType } from '../../shared/models';

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
  data: {
    input: string | number;
    statusCode: number;
    request: string;
  };
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

export const isTVShow = (media: MovieResultDto | TVResultDto | PersonResultDto): media is TVResultDto => media.media_type === MediaType.TV
export const isMovie = (media: MovieResultDto | TVResultDto | PersonResultDto): media is MovieResultDto => media.media_type === MediaType.MOVIE
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

export type CreateListResponse = {
  tvShowResponses: CreateListTVShowResponses;
  movieResponses: CreateListMoviesResponses;
};

export type CreateListTVShowResponses = {
  status: ResponseStatus;
  successful: ResponseSuccess<TVDetailsDto>[];
  failed: ResponseError[];
  error: any | null;
};

export type CreateListMoviesResponses = {
  status: ResponseStatus;
  successful: ResponseSuccess<MovieDetailsDto>[];
  failed: ResponseError[];
  error: any | null;
};


}
