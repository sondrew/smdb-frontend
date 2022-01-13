import { TMDbMovie } from '../Models/BackendModels';

const apiBaseUrl = 'http://localhost:8080';

export const getFavouriteMovies = (): Promise<TMDbMovie[]> =>
  fetchJson(apiBaseUrl + '/favourites');

export const getDiscoverMovies = (): Promise<TMDbMovie[]> =>
  fetchJson(apiBaseUrl + '/discover');

export const saveMovie = (externalId: number) =>
  fetchJson(apiBaseUrl + '/save/' + externalId);

export const unsaveMovie = (externalId: number) =>
  fetchJson(apiBaseUrl + '/unsave/' + externalId);

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
