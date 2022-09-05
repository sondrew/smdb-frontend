import { CreateRecommendationListEntity } from './entityModels';

const admin = require('firebase-admin');
admin.initializeApp();

export const saveRecommendationList = async (
  list: CreateRecommendationListEntity
): Promise<string> => {
  const addList = await admin.firestore().collection('recommendationLists').add(list);
  return addList.id;
};
