import {ApiResponse, ResponseStatus, TMDbMultiSearchDto} from "./backendModels";
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
    .filter((media) => media.media_type === MediaType.TV || media.media_type === MediaType.MOVIE)
    .map((media) => {
      if (media.media_type === MediaType.TV) {
        return {
          id: media.id,
          title: media.name,
          mediaType: MediaType.TV,
          voteAverage: media.vote_average,
          voteCount: media.vote_count,
          popularity: media.popularity,
          overview: media.overview,
          posterUrl: getPosterUrl(media.poster_path),
          releaseDate: media.first_air_date,
          originalTitle: media.original_name
        } as SearchItem
      } else {
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
    }).sort((a, b) => b.popularity - a.popularity)
}

const getPosterUrl = (path: string | null): string => {
  if (path !== null) return `${POSTER_BASE_URL}${path}`
  else return "";
}


