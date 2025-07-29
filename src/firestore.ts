import { db } from './firebase';
import { collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore';
import { RecommendationList, RecommendedMedia } from '../shared/models';
import {
  CreateMediaProvidersListEntity,
  CreateRecommendationListEntity,
} from '../functions/src/entityModels';
import firebase from 'firebase/compat';

export const getRecommendationList = async (listId: string): Promise<RecommendationList | null> => {
  console.log('getRecommendationList');
  const docRef = doc(db, 'recommendationLists', listId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log('data', data);

    const mediaList: RecommendedMedia[] = data.list
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
      .sort((n1: RecommendedMedia, n2: RecommendedMedia) => n1.listIndex - n2.listIndex); // doesn't quite work?

    console.log('mediaList');
    console.log(mediaList);

    const movieIds = mediaList
      .filter((item) => item.mediaType === 'movie')
      .map((item) => item.id.toString());
    console.log('MovieIds: ', movieIds);

    const tvShowIds = mediaList
      .filter((item) => item.mediaType === 'tv')
      .map((item) => item.id.toString());
    console.log('TvShowIds: ', tvShowIds);

    //console.log('movie ids: ', movieIds);
    //console.log('tv show ids: ', tvShowIds);
    const movieProvider = await fetchProviders(movieIds, 'movieProviders');
    console.log('movieProviders');
    console.log(movieProvider);
    const tvShowProvider = await fetchProviders(movieIds, 'tvProviders'); // tvProviders??
    console.log('tvShowProviders');
    console.log(tvShowProvider);

    const newList: RecommendedMedia[] = mediaList.map((item) => {
      let provider: CreateMediaProvidersListEntity | null;
      console.log('Looping media items to add providers', item);

      if (item.mediaType === 'movie') {
        console.log('trying to find provider for movie');
        provider =
          movieProvider.find((providerItem) => item.id.toString() == providerItem.id) ?? null;
        console.log('provider: ', provider);
      } else {
        console.log('trying to find provider for tv show');
        provider =
          movieProvider.find((providerItem) => item.id.toString() == providerItem.id) ?? null;
        console.log('provider: ', provider);
      }

      console.log('PROVIDER FOR MEDIA');
      console.log(provider);

      return {
        ...item,
        countriesWithProviders: provider?.countries ?? null,
      } as RecommendedMedia;
    });

    const recommendationList = {
      id: docSnap.id,
      listName: data.listName,
      listDescription: data.listDescription,
      list: newList,
    } as RecommendationList;

    return recommendationList;

    //return new RecommendationListWithProviders(recommendationList, movieProvider, tvShowProvider);
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

const fetchProviders = async (
  ids: string[],
  documentPath: 'movieProviders' | 'tvProviders'
): Promise<CreateMediaProvidersListEntity[]> => {
  console.log('fetchProviders for ', ids);
  if (ids.length === 0) {
    console.log(`No ${documentPath} ids provided, not fetching providers`);
    return [];
  }

  const chunkedIds = chunk(ids, 10);

  // use lodash _.chunk, for example
  const result = await Promise.all(
    chunkedIds.map(async (chunkIds: string[]): Promise<CreateMediaProvidersListEntity[]> => {
      console.log('CHUNK', chunkIds);
      const mediaProviders = await getDocs(
        query(collection(db, documentPath), where(documentId(), 'in', chunkIds))
      );
      console.log('query done');
      return mediaProviders.docs
        .filter((doc) => doc.exists())
        .map((doc) => {
          console.log('INSIDE DOC data');
          const data = doc.data();
          console.log(data);

          return {
            id: data.id,
            lastUpdated: data.lastUpdated,
            countries: data.countries,
          } as CreateMediaProvidersListEntity;
        });
    })
  );
  /*.then((items) => {
    console.log('THEN ALL');
    console.log(items);
    return items;
  });
     */
  console.log('RESULT');
  console.log(result);

  return result.flat(1);
};

const chunk = (arr: string[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_: any, i: number) =>
    arr.slice(i * size, i * size + size)
  );
