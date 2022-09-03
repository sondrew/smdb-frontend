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
