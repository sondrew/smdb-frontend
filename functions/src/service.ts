import {
  ApiResponse,
  isMovie,
  isTVShow,
  MovieResultDto,
  ResponseStatus,
  TMDbMultiSearchDto,
  TVResultDto
} from "./backendModels";
import {MediaType, SearchItem} from "../../shared/models";
import {searchMulti} from "./tmdbGateway";

//const IMDB_BASE_URL = "https://www.imdb.com/title/"
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"


export const searchMovieOrTV = async (query: string, apiKey: string): Promise<SearchItem[]>  => {
  const searchResult: ApiResponse<TMDbMultiSearchDto> = await searchMulti(query, apiKey)

  switch (searchResult.status) {
    case ResponseStatus.ERROR:
      return [];
    case ResponseStatus.OK:
      return mapAndFilterSearchResults(searchResult.data)
  }
}


const mapAndFilterSearchResults = (response: TMDbMultiSearchDto): SearchItem[] => {
  if (response.total_results === 0) return []

  return response.results
    .filter((media): media is MovieResultDto | TVResultDto => isTVShow(media) || isMovie(media))
    .map((media) => {
      if (isTVShow(media)) return mapTVShowToSearchItem(media)
      else return mapMovieToSearchItem(media)
    }).sort((a, b) => b.popularity - a.popularity)
}

const mapTVShowToSearchItem = (tvShow: TVResultDto): SearchItem => {
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
    originalTitle: tvShow.original_name
  } as SearchItem
}

const mapMovieToSearchItem = (media: MovieResultDto): SearchItem => {
  return {
    id: media.id,
    title: media.title,
    mediaType: MediaType.TV,
    voteAverage: media.vote_average,
    voteCount: media.vote_count,
    popularity: media.popularity,
    overview: media.overview,
    posterUrl: getPosterUrl(media.poster_path),
    releaseDate: media.release_date,
    originalTitle: media.original_title
  } as SearchItem
}

const getPosterUrl = (path: string | null): string => {
  if (path !== null) return `${POSTER_BASE_URL}${path}`
  else return "";
}


