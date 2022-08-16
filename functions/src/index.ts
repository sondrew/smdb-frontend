import * as functions from "firebase-functions";
// https://firebase.google.com/docs/functions/typescript

exports.bigben = functions.region('europe-west1').https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1
  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'BONG '.repeat(hours)}
    </body>
  </html>`);
});


exports.addMessage = functions.region('europe-west1').https.onCall((data, context) => {
  console.log('addMessage callable');
  console.log('data', data);
  console.log('context', context);

  return {
    response: "testing 12"
  }

  /* Enable app check in hosting and then use here:
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.')
  }
   */
});
