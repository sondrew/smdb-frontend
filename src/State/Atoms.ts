import { atom } from 'recoil';
import { SearchItem } from '../../shared/models';

export const SearchList = atom({
  key: 'recommendationList',
  default: [] as SearchItem[],
});
