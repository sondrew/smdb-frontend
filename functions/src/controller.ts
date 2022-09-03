import * as functions from "firebase-functions";
import {searchMovieOrTV} from "./service";
import {SearchItem} from "../../shared/models";

exports.searchMoviesAndTV = functions
  .region('europe-west1')
  .runWith({secrets: ['TMDB_API_KEY']})
  .https.onCall(async (data, context): Promise<SearchItem[]> => {
    console.log(context.app);
    if (context.app == undefined) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.')
    }

    return await searchMovieOrTV(data, process.env.TMDB_API_KEY ?? "")
  })

