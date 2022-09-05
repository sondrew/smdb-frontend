import * as functions from 'firebase-functions';
import { searchMovieOrTV } from './service';
import { SearchItem } from '../../shared/models';
import { CallableContext } from 'firebase-functions/lib/common/providers/https';

exports.searchMoviesAndTV = functions
  .region('europe-west1')
  .runWith({ secrets: ['TMDB_API_KEY'] })
  .https.onCall(async (query: string, context: CallableContext): Promise<SearchItem[]> => {
    console.log(context.app);
    returnErrorIfNotVerified(context);

    return await searchMovieOrTV(query, process.env.TMDB_API_KEY ?? '');
  });

const returnErrorIfNotVerified = (context: CallableContext) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }
};
