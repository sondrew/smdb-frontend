import {
  ApiResponse,
  isMovie,
  isTVShow,
  MovieSearchResultDto,
  ResponseStatus,
  TMDbMultiSearchDto,
  TVSearchResultDto,
} from './backendModels';
import { CreateListRequest, MediaType, SearchItem } from '../../shared/models';
import { getMovieAndTVShowDetails, searchMulti } from './tmdbGateway';

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
