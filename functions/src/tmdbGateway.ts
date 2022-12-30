import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  MovieAndTVShowDetailsResponse,
  MovieDetailsDto,
  MultipleMediaDetailResponses,
  ResponseError,
  ResponseErrorData,
  ResponseStatus,
  ResponseSuccess,
  TMDbMultiSearchDto,
  TVDetailsDto,
} from './backendModels';

const baseUrl = 'https://api.themoviedb.org/3';

export const searchMulti = (
  query: string,
  apiKey: string
): Promise<ApiResponse<TMDbMultiSearchDto>> => {
  const requestUrl = `${baseUrl}/search/multi?query=${query}&api_key=${apiKey}`;

  return axios
    .get(requestUrl)
    .then((response: AxiosResponse<TMDbMultiSearchDto>) => {
      return Promise.resolve({
        status: ResponseStatus.OK,
        data: response.data as TMDbMultiSearchDto,
      } as ResponseSuccess<TMDbMultiSearchDto>);
    })
    .catch((err) => {
      console.warn(`Error: Request searchMulti failed for search query '${query}'`);
      console.log(err?.response);
      return Promise.reject({
        status: ResponseStatus.ERROR,
        data: {
          statusCode: err?.response?.status,
          request: 'searchMulti',
          input: query,
        },
      } as ResponseError);
    });
};

export const getMovieAndTVShowDetails = async (
  movieIds: number[],
  tvShowIds: number[],
  apiKey: string,
  withProviders: boolean = false
) => {
  const tvDetails = await getMultipleTVShowDetails(tvShowIds, apiKey, withProviders);
  const movieDetails = await getMultipleMoviesDetails(movieIds, apiKey, withProviders);

  return new MovieAndTVShowDetailsResponse(movieDetails, tvDetails);
};

export const getMultipleTVShowDetails = async (
  tmdbIds: number[],
  apiKey: string,
  withProviders: boolean = false
): Promise<MultipleMediaDetailResponses<TVDetailsDto>> => {
  if (tmdbIds.length === 0) {
    return MultipleMediaDetailResponses.returnEmptyResponse();
  }

  const tvShowRequests = tmdbIds.map((tvShowId) =>
    getTVShowDetails(tvShowId, apiKey, withProviders)
  );

  return await axios
    .all([...tvShowRequests])
    .then(
      axios.spread((...responses) => {
        return new MultipleMediaDetailResponses(responses);
      })
    )
    .catch((error: ResponseError) => {
      console.warn(`Error: Request getMultipleTVShowDetails failed for ids ${tmdbIds}`);
      console.log(error);
      return new MultipleMediaDetailResponses<TVDetailsDto>([], error.data);
    });
};

export const getMultipleMoviesDetails = async (
  tmdbIds: number[],
  apiKey: string,
  withProviders: boolean = false
): Promise<MultipleMediaDetailResponses<MovieDetailsDto>> => {
  if (tmdbIds.length === 0) {
    return MultipleMediaDetailResponses.returnEmptyResponse();
  }

  const movieRequests = tmdbIds.map((tvShowId) => getMovieDetails(tvShowId, apiKey, withProviders));

  return await axios
    .all([...movieRequests])
    .then(
      axios.spread((...responses) => {
        return new MultipleMediaDetailResponses(responses);
      })
    )
    .catch((error: ResponseError) => {
      console.warn(`Error: Request getMultipleMovieDetails failed for ids ${tmdbIds}`);
      console.log(error);
      return new MultipleMediaDetailResponses<MovieDetailsDto>([], error.data);
    });
};

export const getTVShowDetails = async (
  tmdbId: number,
  apiKey: string,
  withProviders: boolean = false
): Promise<ApiResponse<TVDetailsDto>> => {
  const requestUrl = `${baseUrl}/tv/${tmdbId}?api_key=${apiKey}&append_to_response=external_ids${
    withProviders ? ',external_ids&watch/providers' : ''
  }`;
  console.log('get tv');
  return axios
    .get(requestUrl)
    .then((response: AxiosResponse<TVDetailsDto>) => {
      return Promise.resolve({
        status: ResponseStatus.OK,
        data: response.data as TVDetailsDto,
      } as ResponseSuccess<TVDetailsDto>);
    })
    .catch((err) => {
      console.warn(`Error: Request getTVShowDetails failed for id '${tmdbId}'`);
      console.log(err?.response);
      return Promise.reject({
        status: ResponseStatus.ERROR,
        data: {
          statusCode: err?.response?.status,
          request: 'getTVShowDetails',
          input: tmdbId,
        },
      } as ResponseError);
    });
};

export const getMovieDetails = (
  tmdbId: number,
  apiKey: string,
  withProviders: boolean = false
): Promise<ApiResponse<MovieDetailsDto>> => {
  const requestUrl = `${baseUrl}/movie/${tmdbId}?api_key=${apiKey}${
    withProviders ? '&append_to_response=watch/providers' : ''
  }`;

  return axios
    .get(requestUrl)
    .then((response: AxiosResponse<MovieDetailsDto>) => {
      return Promise.resolve({
        status: ResponseStatus.OK,
        data: response.data as MovieDetailsDto,
      } as ResponseSuccess<MovieDetailsDto>);
    })
    .catch((err) => {
      console.warn(`Error: Request getMovieDetails failed for id '${tmdbId}'`);
      console.log(err?.response);
      return Promise.reject({
        status: ResponseStatus.ERROR,
        data: {
          statusCode: err?.response?.status,
          request: 'getMovieDetails',
          input: tmdbId,
        },
      } as ResponseError);
    });
};
