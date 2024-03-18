import {
  ApiResponse,
  isMovie,
  isTVShow,
  MediaIdsOfTypes,
  MovieAndTVShowDetailsResponse,
  MovieDetailsDto,
  MovieSearchResultDto,
  ResponseStatus,
  ResponseSuccess,
  StreamingCountryDetailsDto,
  StreamingOptionDto,
  TMDbMultiSearchDto,
  TVDetailsDto,
  TVSearchResultDto,
  WatchProviders,
} from './backendModels';
import {
  CountriesWithWatchProvider,
  MediaType,
  SearchItem,
  WatchProvider,
} from '../../shared/models';
import { getMovieAndTVShowDetails, getMultipleMoviesDetails, searchMulti } from './tmdbGateway';
import {
  getMediaItemsForList,
  saveWatchProvidersToDb,
  saveRecommendationList,
} from './firestoreGateway';
import { CreateListRequest } from '../../shared/requestModels';
import { CreateMediaProvidersListEntity } from './entityModels';
import { Timestamp } from 'firebase-admin/firestore';

//const IMDB_BASE_URL = "https://www.imdb.com/title/"
const FALLBACK_POST_URL =
  'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg'; // TODO: Change this
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // TODO: Change to use a lower resolution for faster loading and less data usage?

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
  console.log('movies', movies);
  const tvShows = createList.list
    .filter((media) => media.mediaType === MediaType.TV)
    .map((media) => media.tmdbId);
  console.log('tvShows', tvShows);
  const responses = await getMovieAndTVShowDetails(movies, tvShows, true, apiKey);
  console.log('responses', responses);
  const recommendationList = responses.toCreateRecommendationListEntity(createList);
  console.log('recommendationList', recommendationList);
  const listId = await saveRecommendationList(recommendationList);
  console.log('got listId:', listId);
  console.log('Saving watch providers to db');
  await saveWatchProviders(responses);
  // TODO: Save watch providers to db
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
    true,
    apiKey
  );

  console.log('');
  console.log('moviesAndShows');
  console.log(moviesAndShows);
  console.log('\n\n\n===========================================\n\n\n');

  //printWatchProviders(moviesAndShows);

  // TODO: Move this to when creating recommendation list
  await saveWatchProviders(moviesAndShows);

  const watchProviderLogoBaseUrl = 'https://image.tmdb.org/t/p/original/';

  return mediaItems;
};

const saveWatchProviders = async (moviesAndShows: MovieAndTVShowDetailsResponse) => {
  const now = Timestamp.now();

  const mapMediaDetailsToProviderList = (
    mediaItems: ResponseSuccess<MovieDetailsDto | TVDetailsDto>[]
  ): CreateMediaProvidersListEntity[] => {
    return mediaItems.map((mediaItem: ResponseSuccess<MovieDetailsDto | TVDetailsDto>) => {
      const countries = mediaItem.data['watch/providers']?.results;
      const providers: CreateMediaProvidersListEntity = {
        id: String(mediaItem.data.id),
        lastUpdated: now,
        countries: !!countries ? createCountryProvidersModel(countries) : null, // set to null for media items without providers
      };
      return providers;
    });
  };

  const createCountryProvidersModel = (media: {
    [countryCode: string]: StreamingCountryDetailsDto;
  }): CountriesWithWatchProvider | null => {
    const countryCodes = Object.keys(media);
    if (countryCodes.length === 0) return null;
    const countryProviderMap: CountriesWithWatchProvider = {};

    countryCodes.forEach((countryCode) => {
      const countryProviders = media[countryCode];
      countryProviderMap[countryCode] = {
        link: countryProviders?.link ?? null,
        flatrate: streamingOptionDtoToEntity(countryProviders?.flatrate),
        rent: streamingOptionDtoToEntity(countryProviders?.rent),
        buy: streamingOptionDtoToEntity(countryProviders?.buy),
      };
    });

    return countryProviderMap;
  };

  const streamingOptionDtoToEntity = (countries?: StreamingOptionDto[]): WatchProvider[] => {
    if (!countries || countries.length === 0) return [];
    return countries.map((country: StreamingOptionDto) => ({
      displayPriority: country.display_priority,
      logoPath: country.logo_path,
      providerId: country.provider_id,
      providerName: country.provider_name,
    }));
  };

  /*
  Currently I've chosen to store all movies/tv shows even though they don't have known watch providers
  Will take new look at best way of storing/retrieving when making functionality to get providers
  in the frontend for the whole list and ways of dealing with movies/shows that has no providers

  const moviesWithProviders = moviesAndShows.movieResponses.data.filter(
    (movie: ResponseSuccess<MovieDetailsDto>) => !!movie.data['watch/providers']?.results
  );

  const tvShowsWithProviders = moviesAndShows.tvShowResponses.data.filter(
    (tvShow: ResponseSuccess<TVDetailsDto>) => !!tvShow.data['watch/providers']?.results
  );
   */

  const movieProviders = mapMediaDetailsToProviderList(moviesAndShows.movieResponses.data);
  const tvShowProviders = mapMediaDetailsToProviderList(moviesAndShows.tvShowResponses.data);

  await saveWatchProvidersToDb(movieProviders, tvShowProviders)
    .then(() => console.log('saveMediaProviders done!'))
    .catch((err) => console.error('saveMediaProviders error:,', err));
};

const printWatchProviders = (moviesAndShows: MovieAndTVShowDetailsResponse) => {
  const printCountryProvidersPerMediaItem = (mediaName: string, watchProvider?: WatchProviders) => {
    const results = watchProvider?.results;
    if (!!results) {
      console.log(`\nStreaming options for ${mediaName}`);
      for (const key in results) {
        const rentProviders = results[key]?.rent?.map((provider) => provider.provider_name) ?? [];
        const buyProviders = results[key]?.buy?.map((provider) => provider.provider_name) ?? [];
        const flatrateProviders =
          results[key]?.flatrate?.map((provider) => provider.provider_name) ?? [];

        console.log('\nCOUNTRY CODE:', key);
        console.log(`${rentProviders.length} rent providers: ${rentProviders}`);
        console.log(`${buyProviders.length} buy providers: ${buyProviders}`);
        console.log(`${flatrateProviders.length} flat providers: ${flatrateProviders}`);
      }
    } else {
      console.log(`\nNo streaming options for ${mediaName}`);
    }
  };

  moviesAndShows.tvShowResponses.data.forEach((each: ResponseSuccess<TVDetailsDto>) =>
    printCountryProvidersPerMediaItem(each.data.name, each.data['watch/providers'])
  );

  moviesAndShows.movieResponses.data.forEach((each: ResponseSuccess<MovieDetailsDto>) =>
    printCountryProvidersPerMediaItem(each.data.title, each.data['watch/providers'])
  );
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
