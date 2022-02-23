import { atom } from 'recoil';

type AtributeInfo = {
  name: string;
  betterWhen: 'greater' | 'lesser';
};

type HumanInput = {
  attributesPrioritiesTable: number[][];
  attributesInfo: AtributeInfo[];
};

type IPriorityType = 'superior' | 'inferior';

export const attributesPrioritiesState = atom<number[][]>({
  key: 'attributesPrioritiesState',
  default: [],
});

export const attributesState = atom<string[]>({
  key: 'attributesState',
  default: [],
});

export const attributesInfoState = atom<AtributeInfo[]>({
  key: 'attributesInfoState',
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
