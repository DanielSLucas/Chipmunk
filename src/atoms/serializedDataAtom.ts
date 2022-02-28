import { atom } from 'recoil';

type SerializedData = {
  attributesValues: {
    [attribute: string]: number[];
  };
  serializedItems: Record<string, number>[];
};

export const serializedDataState = atom<SerializedData>({
  key: 'serializedDataState',
  default: {} as SerializedData,
});
