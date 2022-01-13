import { TMDbMovie } from '../Models/BackendModels';

const apiBaseUrl = 'http://localhost:8080';

export const getFavouriteMovies = () => fetchJson(apiBaseUrl + '/favourite');

export const getDiscoverMovies = (): Promise<TMDbMovie[]> =>
  fetchJson(apiBaseUrl + '/discover');

export const fetchJson = (
  url: string,
  method: string = 'GET',
  requestBody: any = null
) => {
  const body =
    method !== 'GET' && method !== 'HEAD' && requestBody != null
      ? JSON.stringify(requestBody)
      : null;
  const headers = {
    Accept: 'application/json',
    ...(['POST', 'PUT', 'PATCH'].includes(method) && {
      'Content-Type': 'application/json',
    }),
  };

  return fetch(url, {
    method,
    headers,
    body,
  }).then((res) => res.json());
};
