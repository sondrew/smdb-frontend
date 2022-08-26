import * as functions from "firebase-functions";
import axios, {AxiosResponse} from "axios";
import {TMDbMultiSearchDto} from "./models";
import {MediaType, SearchItem} from "../../shared/models";

//const IMDB_BASE_URL = "https://www.imdb.com/title/"
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"


const baseUrl = 'https://api.themoviedb.org/3'


exports.searchMulti = functions.region('europe-west1').https.onCall((data, context) => {
  console.log('searchQuery', data);

  const requestUrl = `${baseUrl}/search/multi?query=${data}&${apiKey}`

  return axios.get(requestUrl).then((res: AxiosResponse<TMDbMultiSearchDto>) => {
    console.log('then');
    console.log('then');
    const searchResult = mapAndFilterSearchResults(res.data)

    return {
      status: 'ok',
      result: searchResult
    }
    //return res.data.results
  }).catch((err) => {
      console.log('err');
      console.log(err);
      return {
        status: 'error',
        error: err
      }
  })

  //console.log('request');
  //console.log(request);
})

const mapAndFilterSearchResults = (response: TMDbMultiSearchDto): SearchItem[] => {
  if (response.total_results === 0) return []

  return response.results
    .filter((media) => media.media_type === MediaType.TV || media.media_type === MediaType.MOVIE)
    .map((media) => {
      if (media.media_type === MediaType.TV) {
        console.log(media.name);
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
        console.log(media.title);
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

