import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  ResponseError,
  ResponseStatus,
  ResponseSuccess,
  TMDbMultiSearchDto,
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
  apiKey: string
) => {
  const tvDetails = await getMultipleTVShowDetails(tvShowIds, apiKey);
  const movieDetails = await getMultipleMoviesDetails(movieIds, apiKey);

  return {
    tvShowResponses: tvDetails,
    movieResponses: movieDetails,
  } as CreateListResponse;
};

export const getMultipleTVShowDetails = async (
  tmdbIds: number[],
  apiKey: string
): Promise<CreateListTVShowResponses> => {
  const tvShowRequests = tmdbIds.map((tvShowId) => getTVShowDetails(tvShowId, apiKey));

  return await axios
    .all([...tvShowRequests])
    .then(
      axios.spread((...responses) => {
        const successfulResponses = responses.filter(
          (response): response is ResponseSuccess<TVDetailsDto> =>
            response.status === ResponseStatus.OK
        );
        const failedResponses = responses.filter(
          (response): response is ResponseError => response.status === ResponseStatus.ERROR
        );

        return {
          status: ResponseStatus.OK,
          successful: successfulResponses,
          failed: failedResponses,
          error: null,
        } as CreateListTVShowResponses;
      })
    )
    .catch((error) => {
      console.warn(`Error: Request getMultipleTVShowDetails failed for ids ${tmdbIds}`);
      console.log(error);
      return {
        status: ResponseStatus.ERROR,
        successful: [],
        failed: [],
        error: error?.data,
      } as CreateListTVShowResponses;
    });
};

export const getMultipleMoviesDetails = async (
  tmdbIds: number[],
  apiKey: string
): Promise<CreateListMoviesResponses> => {
  const movieRequests = tmdbIds.map((tvShowId) => getMovieDetails(tvShowId, apiKey));

  return await axios
    .all([...movieRequests])
    .then(
      axios.spread((...responses) => {
        console.log('TV ALL THEN');
        console.log(responses);

        const successfulResponses = responses.filter(
          (response): response is ResponseSuccess<MovieDetailsDto> =>
            response.status === ResponseStatus.OK
        );
        const failedResponses = responses.filter(
          (response): response is ResponseError => response.status === ResponseStatus.ERROR
        );

        return {
          status: ResponseStatus.OK,
          successful: successfulResponses,
          failed: failedResponses,
          error: null,
        } as CreateListMoviesResponses;
      })
    )
    .catch((error) => {
      console.warn(`Error: Request getMultipleMovieDetails failed for ids ${tmdbIds}`);
      console.log(error);
      return {
        status: ResponseStatus.ERROR,
        successful: [],
        failed: [],
        error: error?.data,
      } as CreateListMoviesResponses;
    });
};

export const getTVShowDetails = async (
  tmdbId: number,
  apiKey: string,
  withProviders: boolean = false
): Promise<ApiResponse<TVDetailsDto>> => {
  const requestUrl = `${baseUrl}/tv/${tmdbId}?api_key=${apiKey}${
    withProviders ? '&append_to_response=watch/providers' : ''
  }`;
  console.log('get tv');
  return axios
    .get(requestUrl)
    .then((response: AxiosResponse<TVDetailsDto>) => {
      console.log('tv then');
      console.log(response.data.name);
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

  console.log('get movie');

  return axios
    .get(requestUrl)
    .then((response: AxiosResponse<MovieDetailsDto>) => {
      console.log('movie then');
      console.log(response.data.title);
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
