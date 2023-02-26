import { CreateMediaProvidersListEntity, CreateRecommendationListEntity } from './entityModels';
import { MediaIdsOfTypes } from './backendModels';

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

export const saveRecommendationList = async (
  list: CreateRecommendationListEntity
): Promise<string> => {
  const addList = await db.collection('recommendationLists').add(list);
  return addList.id;
};

export const saveWatchProviders = async (
  movieList: CreateMediaProvidersListEntity[],
  tvList: CreateMediaProvidersListEntity[]
) => {
  const batch = db.batch();

  movieList.forEach((doc) => {
    batch.set(db.collection('movieProviders').doc(doc.id), doc, { merge: false });
  });

  tvList.forEach((doc) => {
    batch.set(db.collection('tvProviders').doc(doc.id), doc, { merge: false });
  });

  batch
    .commit()
    .then(() => {
      // result: firestore.WriteResult[]
      console.log('saveMediaProviders: Successfully upserted watch providers to db');
    })
    .catch((err: any) => {
      console.error('saveMediaProviders: Failed upserting watch providers to db, ', err);
    });
};

export const getMediaItemsForList = async (listId: string): Promise<MediaIdsOfTypes> => {
  const recommendationList = await db
    .collection('recommendationLists')
    .doc(listId)
    .get()
    .then((res: any) => {
      return res.data();
    })
    .catch((err: any) => {
      console.error('getMediaItemsForList: Failed retrieving list from db,', err);
    });

  // todo: rewrite with types
  const movieIds = recommendationList.list
    .filter((item: any) => item.mediaType === 'movie')
    .map((item: any) => item.id);
  const showIds = recommendationList.list
    .filter((item: any) => item.mediaType === 'tv')
    .map((item: any) => item.id);

  const mediaIdAndMediaType: MediaIdsOfTypes = {
    movies: movieIds,
    shows: showIds,
  };

  return mediaIdAndMediaType;
};
