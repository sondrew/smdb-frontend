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
      return Promise.reject({
        status: ResponseStatus.ERROR,
        data: err,
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

  console.log('TV DETAILS AFTER');
  console.log(tvDetails);

  console.log('after await');
  console.log(movieDetails);

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
        console.log('TV ALL THEN');
        console.log(responses);

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
    .catch((err) => {
      return {
        status: ResponseStatus.ERROR,
        successful: [],
        failed: [],
        error: err,
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
    .catch((err) => {
      return {
        status: ResponseStatus.ERROR,
        successful: [],
        failed: [],
        error: err,
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
      console.log('TV ERROR');
      console.log(err);
      return Promise.reject({
        status: ResponseStatus.ERROR,
        data: err,
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
      console.log('MOVIE ERROR');
      console.log(err);
      return Promise.reject({
        status: ResponseStatus.ERROR,
        data: err,
      } as ResponseError);
    });
};
