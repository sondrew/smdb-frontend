import {
  ApiResponse,
  isMovie,
  isTVShow,
  MediaIdsOfTypes,
  MovieAndTVShowDetailsResponse,
  MovieSearchResultDto,
  ResponseStatus,
  TMDbMultiSearchDto,
  TVSearchResultDto,
} from './backendModels';
import { MediaType, SearchItem } from '../../shared/models';
import { getMovieAndTVShowDetails, getMultipleMoviesDetails, searchMulti } from './tmdbGateway';
import { getMediaItemsForList, saveRecommendationList } from './firestoreGateway';
import { CreateListRequest } from '../../shared/requestModels';

//const IMDB_BASE_URL = "https://www.imdb.com/title/"
const FALLBACK_POST_URL =
  'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const searchMovieOrTV = async (query: string, apiKey: string): Promise<SearchItem[]> => {
  const searchResult: ApiResponse<TMDbMultiSearchDto> = await searchMulti(query, apiKey);

  switch (searchResult.status) {
    case ResponseStatus.ERROR:
      return [];
    case ResponseStatus.OK:
      return mapAndFilterSearchResults(searchResult.data);
  }
};

export const createRecommendationList = async (createList: CreateListRequest, apiKey: string) => {
  const movies = createList.list
    .filter((media) => media.mediaType === MediaType.MOVIE)
    .map((media) => media.tmdbId);
  const tvShows = createList.list
    .filter((media) => media.mediaType === MediaType.TV)
    .map((media) => media.tmdbId);

  const responses = await getMovieAndTVShowDetails(movies, tvShows, apiKey);
  const recommendationList = responses.toCreateRecommendationListEntity(createList);
  const listId = await saveRecommendationList(recommendationList);
  return MovieAndTVShowDetailsResponse.toRecommendationList(recommendationList, listId);
};

export const getProvidersForCountry = async (
  listId: string,
  countryCode: string,
  apiKey: string
) => {
  const mediaItems: MediaIdsOfTypes = await getMediaItemsForList(listId);
  console.log('mediaItems', mediaItems);

  const moviesAndShows = await getMovieAndTVShowDetails(
    mediaItems.movies,
    mediaItems.shows,
    apiKey,
    true
  );

  console.log('');
  console.log('moviesAndShows');
  console.log(moviesAndShows);

  return mediaItems;
};

const mapAndFilterSearchResults = (response: TMDbMultiSearchDto): SearchItem[] => {
  if (response.total_results === 0) return [];

  return response.results
    .filter(
      (media): media is MovieSearchResultDto | TVSearchResultDto =>
        isTVShow(media) || isMovie(media)
    )
    .map((media) => {
      if (isTVShow(media)) return mapTVShowToSearchItem(media);
      else return mapMovieToSearchItem(media);
    })
    .sort((a, b) => b.popularity - a.popularity);
};

const mapTVShowToSearchItem = (tvShow: TVSearchResultDto): SearchItem => {
  return {
    id: tvShow.id,
    title: tvShow.name,
    mediaType: MediaType.TV,
    voteAverage: tvShow.vote_average,
    voteCount: tvShow.vote_count,
    popularity: tvShow.popularity,
    overview: tvShow.overview,
    posterUrl: getPosterUrl(tvShow.poster_path),
    releaseDate: tvShow.first_air_date,
    originalTitle: tvShow.original_name,
  } as SearchItem;
};

const mapMovieToSearchItem = (media: MovieSearchResultDto): SearchItem => {
  return {
    id: media.id,
    title: media.title,
    mediaType: MediaType.MOVIE,
    voteAverage: media.vote_average,
    voteCount: media.vote_count,
    popularity: media.popularity,
    overview: media.overview,
    posterUrl: getPosterUrl(media.poster_path),
    releaseDate: media.release_date,
    originalTitle: media.original_title,
  } as SearchItem;
};

const getPosterUrl = (path: string | null): string => {
  if (path !== null) return `${POSTER_BASE_URL}${path}`;
  else return FALLBACK_POST_URL;
};
