/* eslint-disable react/no-array-index-key */
import { Flex, Stack } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  attributesPrioritiesState,
  attributesNamesState,
  prioritiesTypesState,
} from '../atoms/attributesAtom';
import AttributePriorityForm from './AttributePriorityForm';

type IPriorityType = 'superior' | 'inferior';

const PrioritiesForm: React.FC = () => {
  const attributes = useRecoilValue(attributesNamesState);
  const [attributesPriorities, setAttributesPriorities] = useRecoilState(
    attributesPrioritiesState,
  );

  const [prioritiesTypes, setPrioritiesTypes] =
    useRecoilState(prioritiesTypesState);

  const setPriorityType = useCallback(
    (value: IPriorityType, coords: number[]) => {
      const [x, y] = coords;

      setPrioritiesTypes(state => {
        return state.map((row, i) => {
          return row.map((item, j) => {
            if (i === x && y === j) return value;
            return item;
          });
        });
      });
    },
    [setPrioritiesTypes],
  );

  const setPriority = useCallback(
    (
      coords: number[],
      value: string,
      priorityType: 'superior' | 'inferior',
    ) => {
      const [x, y] = coords;

      const updatedAttributesPriorities = attributesPriorities.map((row, i) => {
        if (i === x || i === y) {
          return row.map((item, j) => {
            if (
              (priorityType === 'superior' && i === x && j === y) ||
              (priorityType === 'inferior' && i === y && j === x)
            ) {
              return Number(value);
            }

            if (
              (priorityType === 'superior' && i === y && j === x) ||
              (priorityType === 'inferior' && i === x && j === y)
            ) {
              return 1 / Number(value);
            }

            return item;
          });
        }

        return row;
      });

      setAttributesPriorities(updatedAttributesPriorities);
    },
    [attributesPriorities, setAttributesPriorities],
  );

  return (
    <Flex
      direction="column"
      bg="white"
      p="4"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      h="md"
      overflowY="scroll"
    >
      <Stack direction="column" position="relative" spacing="4">
        {attributesPriorities.map((row, i) => {
          return row.map((item, j) => {
            if (j > i) {
              return (
                <Flex key={`${item}-[${i},${j}]`}>
                  <AttributePriorityForm
                    attrb1={attributes[i]}
                    attrb2={attributes[j]}
                    setPriority={setPriority}
                    priorityType={prioritiesTypes[i][j]}
                    setPriorityType={setPriorityType}
                    coords={[i, j]}
                    value={
                      prioritiesTypes[i][j] === 'superior'
                        ? String(item)
                        : String(1 / item)
                    }
                  />
                </Flex>
              );
            }

            return null;
          });
        })}
      </Stack>
    </Flex>
  );
};

export default PrioritiesForm;
