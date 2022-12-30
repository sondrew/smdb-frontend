import * as functions from 'firebase-functions';
import { createRecommendationList, getProvidersForCountry, searchMovieOrTV } from './service';
import { SearchItem } from '../../shared/models';
import { CallableContext } from 'firebase-functions/lib/common/providers/https';
import { CreateListRequest, GetProvidersForCountryRequest } from '../../shared/requestModels';

exports.searchMoviesAndTV = functions
  .region('europe-west1')
  .runWith({ secrets: ['TMDB_API_KEY'] })
  .https.onCall(async (query: string, context: CallableContext): Promise<SearchItem[]> => {
    returnErrorIfNotVerified(context);

    return await searchMovieOrTV(query, process.env.TMDB_API_KEY ?? '');
  });

exports.createRecommendationList = functions
  .region('europe-west1')
  .runWith({ secrets: ['TMDB_API_KEY'] })
  .https.onCall(async (list: CreateListRequest, context: CallableContext) => {
    returnErrorIfNotVerified(context);

    return await createRecommendationList(list, process.env.TMDB_API_KEY ?? '');
  });

exports.getProvidersForCountry = functions
  .region('europe-west1')
  .runWith({ secrets: ['TMDB_API_KEY'] })
  .https.onCall(
    async (request: GetProvidersForCountryRequest, context: CallableContext): Promise<any> => {
      returnErrorIfNotVerified(context);

      console.log('request', request);

      return await getProvidersForCountry(
        request.listId,
        request.countryCode,
        process.env.TMDB_API_KEY ?? ''
      );
    }
  );

const returnErrorIfNotVerified = (context: CallableContext) => {
  if (context.app == undefined) {
    console.warn('Unverified request to a callable function received');
    console.log(context);
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }
};
