import { TMDbMovie, RecommendationList } from '../Models/BackendModels';
import { CreateRecommendationList } from '../Models/FrontendModels';

const apiBaseUrl = 'http://localhost:8080';

export const getFavouriteMovies = (): Promise<TMDbMovie[]> => fetchJson(apiBaseUrl + '/favourites');

export const getDiscoverMovies = (): Promise<TMDbMovie[]> => fetchJson(apiBaseUrl + '/discover');

export const saveMovie = (externalId: number) => fetchJson(apiBaseUrl + '/save/' + externalId);

export const unsaveMovie = (externalId: number) => fetchJson(apiBaseUrl + '/unsave/' + externalId);

export const searchMovieAndTV = (searchQuery: string) =>
  fetchJson(apiBaseUrl + '/search/' + encodeURI(searchQuery));

export const createRecommendationList = async (
  recommendationList: CreateRecommendationList
): Promise<RecommendationList> =>
  await fetchJson(apiBaseUrl + '/create', 'POST', recommendationList);

export const getRecommendationList = async (listId: string): Promise<RecommendationList> =>
  await fetchJson(apiBaseUrl + '/list/' + listId);

export const fetchJson = (url: string, method: string = 'GET', requestBody: any = null) => {
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
