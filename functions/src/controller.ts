import * as functions from "firebase-functions";
import {searchMovieOrTV} from "./service";

exports.searchMoviesAndTV = functions
  .region('europe-west1')
  .runWith({secrets: ['TMDB_API_KEY']})
  .https.onCall(async (data, context) => {
    return await searchMovieOrTV(data, process.env.TMDB_API_KEY ?? "")
  })


