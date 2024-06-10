import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { connectFunctionsEmulator } from 'firebase/functions';
import { RecommendationList, SearchItem } from '../shared/models';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { CreateListRequest, GetProvidersForCountryRequest } from '../shared/requestModels';
//import { getStorage, ref } from "firebase/storage";
//import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyBNukhn5Ztbe2uFhvh3VYAdTiX73Bts1iU',
  authDomain: 'recommender3000.firebaseapp.com',
  projectId: 'recommender3000',
  storageBucket: 'recommender3000.appspot.com',
  messagingSenderId: '555878506033',
  appId: '1:555878506033:web:65bc1ab79bfbcdf418bf10',
};

const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LcN98ohAAAAAD_7oCIpFmm07Z6eI1zh8L31wbUY'),
  isTokenAutoRefreshEnabled: true,
});

export const db = getFirestore(app);

export const functions = getFunctions(app, 'europe-west1');

if (process.env.NODE_ENV === 'development') {
  console.log('Using emulated firebase functions on localhost:5001');
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export const searchMoviesAndTV = httpsCallable<string, SearchItem[]>(
  functions,
  'searchMoviesAndTV'
);

export const createRecommendationList = httpsCallable<CreateListRequest, RecommendationList>(
  functions,
  'createRecommendationList'
);

export const getProvidersForCountry = httpsCallable<
  GetProvidersForCountryRequest,
  RecommendationList
>(functions, 'getProvidersForCountry');

export const getListWithProviders = httpsCallable<string, RecommendationList | null>(
  functions,
  'getListWithProviders'
);
