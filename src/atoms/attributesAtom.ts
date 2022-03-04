import { atom } from 'recoil';

type Attribute = {
  index: number;
  name: string;
  betterWhen: 'greater' | 'lesser';
};

type HumanInput = {
  attributesPrioritiesTable: number[][];
  attributes: Attribute[];
};

type IPriorityType = 'superior' | 'inferior';

export const attributesPrioritiesState = atom<number[][]>({
  key: 'attributesPrioritiesState',
  default: [],
});

export const attributesNamesState = atom<string[]>({
  key: 'attributesNamesState',
  default: [],
});

export const attributesState = atom<Attribute[]>({
  key: 'attributesState',
  default: [],
});

export const humanInputState = atom<HumanInput>({
  key: 'humanInputState',
  default: {} as HumanInput,
});

export const prioritiesTypesState = atom<IPriorityType[][]>({
  key: 'prioritiesTypesState',
  default: [],
});
