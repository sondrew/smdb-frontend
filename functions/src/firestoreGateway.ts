import { CreateMediaProvidersListEntity, CreateRecommendationListEntity } from './entityModels';
import { MediaIdsOfTypes } from './backendModels';
import { RecommendationList, RecommendedMedia } from '../../src/shared/models';

const admin = require('firebase-admin');

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'recommender3000', // Your Firebase project ID
  });
}

const db = admin.firestore();

// Configure Firestore to use emulator when running locally
if (process.env.FUNCTIONS_EMULATOR) {
  db.settings({
    host: "localhost:4242",
    ssl: false,
  });
}

export const saveRecommendationList = async (
  list: CreateRecommendationListEntity
): Promise<string> => {
  const addList = await db.collection('recommendationLists').add(list);
  return addList.id;
};

export const saveWatchProvidersToDb = async (
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

// TODO: Rewrite provider logic to use one table for both movies and tv shows for faster/easier querying on the same table

export const getDbListWithProviders = async (
  listId: string
): Promise<RecommendationList | null> => {
  //Promise<RecommendationList> => {
  console.log('getListWithProviders');
  const recommendationList: RecommendationList | null = await db
    .collection('recommendationLists')
    .doc(listId)
    .get()
    .then((res: any): RecommendationList | null => {
      console.log('then()', res);
      const data = res.data();
      console.log('data', data);

      if (data === undefined) {
        console.log('recommendation list does not exist for listId: ', listId);
        return null;
      }

      //console.log('data', data);
      const typeList = {
        id: listId,
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
          posterPath: getPosterUrl(media.posterPath),
          imdbPath: media.imdbPath,
          genres: media.genres,
        })),
      } as RecommendationList;
      console.log('typeList');
      return typeList;
    })
    .catch((err: any) => {
      console.error('getListWithProviders: Failed retrieving list from db,', err);
      throw new Error('Failed retrieving list from db');
    });

  if (recommendationList === null) return null;

  console.log('outside then()');
  console.log('list', recommendationList);

  const newListWithMediaProvider = await getMediaProviders(recommendationList.list);

  console.log('successfully fetched providers for media items');
  return {
    ...recommendationList,
    list: newListWithMediaProvider.sort(
      (n1: RecommendedMedia, n2: RecommendedMedia) => n1.listIndex - n2.listIndex
    ),
  } as RecommendationList;
};

const getMediaProviders = async (
  recommendationList: RecommendedMedia[]
): Promise<RecommendedMedia[]> => {
  console.log('getMediaProviders');
  const movies = recommendationList.filter((item: RecommendedMedia) => item.mediaType === 'movie');
  const tvShows = recommendationList.filter((item: RecommendedMedia) => item.mediaType === 'tv');

  const movieListWithProviders = await fetchProviders(movies, 'movieProviders');
  const tvListWithProvider = await fetchProviders(tvShows, 'tvProviders');

  return movieListWithProviders.concat(tvListWithProvider);
};

const fetchProviders = async (
  mediaItems: RecommendedMedia[],
  documentPath: 'movieProviders' | 'tvProviders'
): Promise<RecommendedMedia[]> => {
  console.log('fetchProviders for ', documentPath);
  if (mediaItems.length === 0) {
    console.log(`No ${documentPath} ids provided, not fetching providers`);
    return [];
  }

  const mediaProviders = await Promise.all(
    mediaItems.map(async (item: RecommendedMedia): Promise<RecommendedMedia> => {
      return await db
        .collection(documentPath)
        .doc(item.id.toString())
        .get()
        .then((res: any) => {
          console.log(`testPromise then(${item.id})`);
          const data = res.data();
          console.log('data fetched from db', data);

          if (data === undefined) {
            console.log('media providers does not exist for listId: ', item.id);
            return item;
          }

          const providerData: CreateMediaProvidersListEntity = {
            id: data.id,
            lastUpdated: data.lastUpdated,
            countries: data.countries,
          };
          //console.log('providerData', providerData);

          const mediaWithProvider = {
            ...item,
            countriesWithProviders: providerData.countries,
          } as RecommendedMedia;
          console.log('successfully mapped provider to media item');
          //console.log('mediaWithProvider', mediaWithProvider);

          return mediaWithProvider;
        })
        .catch((err: any) => {
          console.error(`Failed fetching provider for ${item.id},`, err);
          throw new Error(`Failed fetching provider for ${item.id}`);
        });
    })
  )
    .then((items: RecommendedMedia[]) => {
      console.log('THEN ALL');
      console.log('Requested items: ', items.length);
      return items;
    })
    .catch((err: any) => {
      console.error('Failed fetching providers for media items,', err);
      throw new Error('Failed fetching providers for media items');
    });
  console.log('testPromise');
  console.log(mediaProviders);

  return mediaProviders;
};

const getPosterUrl = (path: string | null): string => {
  if (path !== null) return `${POSTER_BASE_URL}${path}`;
  else return FALLBACK_POST_URL;
};

const FALLBACK_POST_URL =
  'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
