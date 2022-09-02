import { atom, selector } from 'recoil';
import { TMDbMovie } from '../Models/BackendModels';
import {SearchItem} from "../../shared/models";

export const SavedMovies = atom({
  key: 'savedMovies',
  default: null,
});

export const DiscoverMovies = atom({
  key: 'discoverMovies',
  default: [] as TMDbMovie[],
});

export const SearchList = atom({
  key: 'recommendationList',
  default: [] as SearchItem[],
});

/*
export const DiscoverMoviesState = selector({
  key: 'DiscoverMoviesState',
  get: async ({ get }) => {
    return await getDiscoverMovies();
  },
});

const defaultState = {
  error: null,
  isFetching: false,
  didInvalidate: false,
  hasFetched: false,
  data: null,
};
 */
