import { atom } from 'recoil';

export const SamplesState = atom<(null | number)[][]>({
  key: 'SamplesState',
  default: [],
});
