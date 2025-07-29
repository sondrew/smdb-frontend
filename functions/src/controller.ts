import * as functions from 'firebase-functions';
import {
  createRecommendationList,
  getListWithProviders,
  getProvidersForCountry,
  searchMovieOrTV,
} from './service';
import { RecommendationList, SearchItem } from '../../shared/models';
import { CallableContext } from 'firebase-functions/lib/common/providers/https';
import { CreateListRequest, GetProvidersForCountryRequest } from '../../shared/requestModels';
// All available logging functions
import { log, info, debug, warn, error, write } from 'firebase-functions/logger';

exports.searchMoviesAndTV = functions
  .region('europe-west1')
  .runWith({ secrets: ['TMDB_API_KEY'] })
  .https.onCall(async (query: string, context: CallableContext): Promise<SearchItem[]> => {
    debug('searchMoviesAndTV', query);
    returnErrorIfNotVerified(context);

    // sanitize input? ev. html encode it

    console.log('search movie and tv');
    return await searchMovieOrTV(query, process.env.TMDB_API_KEY ?? '');
  });

exports.createRecommendationList = functions
  .region('europe-west1')
  .runWith({ secrets: ['TMDB_API_KEY'] })
  .https.onCall(async (list: CreateListRequest, context: CallableContext) => {
    returnErrorIfNotVerified(context);

    console.log('create list');
    return await createRecommendationList(list, process.env.TMDB_API_KEY ?? '');
  });

exports.getProvidersForCountry = functions
  .region('europe-west1')
  .runWith({ secrets: ['TMDB_API_KEY'] })
  .https.onCall(
    async (request: GetProvidersForCountryRequest, context: CallableContext): Promise<any> => {
      returnErrorIfNotVerified(context);

      console.log('request', request);
      console.log('get providers');

      return await getProvidersForCountry(
        request.listId,
        request.countryCode,
        process.env.TMDB_API_KEY ?? ''
      );
    }
  );

// could consider rewriting this/adding another that takes in country code and outputs prefered default options and flatrate alternatives in nearby countries
exports.getListWithProviders = functions
  .region('europe-west1')
  .https.onCall(
    async (listId: string, context: CallableContext): Promise<RecommendationList | null> => {
      debug('getListWithProviders', listId);
      returnErrorIfNotVerified(context);

      console.log('get recommendation list with providers from db ', listId);

      return await getListWithProviders(listId);
    }
  );

const returnErrorIfNotVerified = (context: CallableContext) => {
  if (context.app == undefined) {
    warn('Unverified request to a callable function received', context);
    console.warn('Unverified request to a callable function received');
    console.log(context);
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app'
    );
  }
};
