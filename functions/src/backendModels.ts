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
  data: any;
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
}


export const isTVShow = (media: MovieResultDto | TVResultDto | PersonResultDto): media is TVResultDto => media.media_type === MediaType.TV
export const isMovie = (media: MovieResultDto | TVResultDto | PersonResultDto): media is MovieResultDto => media.media_type === MediaType.MOVIE

}
