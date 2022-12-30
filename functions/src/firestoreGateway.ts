import { CreateRecommendationListEntity } from './entityModels';
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
