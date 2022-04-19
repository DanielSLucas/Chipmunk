import { atom } from 'recoil';

export const DataState = atom<(string | number)[][]>({
  key: 'DataState',
  default: [],
});
