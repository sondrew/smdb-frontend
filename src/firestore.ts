import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { RecommendationList, RecommendedMedia } from '../shared/models';

export const getRecommendationList = async (listId: string): Promise<RecommendationList | null> => {
  const docRef = doc(db, 'recommendationLists', listId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      listName: data.listName,
      listDescription: data.listDescription,
      list: data.list.map((media: RecommendedMedia) => ({
        id: media.id,
        listIndex: media.listIndex,
        userRating: media.userRating,
        userComment: media.userComment,
        title: media.title,
        originalTitle: media.originalTitle,
        description: media.description,
        mediaType: media.mediaType,
        posterPath: media.posterPath,
        imdbPath: media.imdbPath,
        genres: media.genres,
      })),
    } as RecommendationList;
  } else {
    return null;
  }
};
