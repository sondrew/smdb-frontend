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
      list: data.list
        .map((media: RecommendedMedia) => ({
          id: media.id,
          listIndex: media.listIndex,
          userRating: media.userRating,
          userComment: media.userComment,
          title: media.title,
          originalTitle: media.originalTitle,
          description: media.description,
          mediaType: media.mediaType,
          posterPath: getPosterUrl(media.posterPath),
          imdbPath: media.imdbPath,
          genres: media.genres,
        }))
        .sort((i: RecommendedMedia) => i.listIndex),
    } as RecommendationList;
  } else {
    return null;
  }
};

const FALLBACK_POST_URL =
  'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const getPosterUrl = (path: string | null): string => {
  if (path !== null) return `${POSTER_BASE_URL}${path}`;
  else return FALLBACK_POST_URL;
};
