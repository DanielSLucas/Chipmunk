import {
  Box,
  Button,
  Flex,
  Select,
  Spinner,
  Tag,
  Text,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MdDragHandle } from 'react-icons/md';
import {
  attributesNamesState,
  attributesPrioritiesState,
  attributesState,
  prioritiesTypesState,
} from '../atoms/ahp/attributesAtom';

type BetterWhen = 'greater' | 'lesser';
type Fields = 'betterWhen' | 'name';

const RankAttributes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const attributesNames = useRecoilValue(attributesNamesState);
  const [rankedAttributes, setRankedAttributes] =
    useRecoilState(attributesState);
  const [, setAttributesPrioritiesTable] = useRecoilState(
    attributesPrioritiesState,
  );
  const [, setPrioritiesTypes] = useRecoilState(prioritiesTypesState);

  useEffect(() => {
    if (rankedAttributes.length === 0) {
      setRankedAttributes(
        attributesNames.map((attribute, i) => {
          return {
            index: i,
            name: attribute,
            betterWhen: 'greater',
          };
        }),
      );
    }
  }, [attributesNames, rankedAttributes.length, setRankedAttributes]);

  const handleDragEnd = useCallback(
    (dropResult: DropResult) => {
      const sourceIndex = dropResult.source.index;
      const destinationIndex = dropResult.destination?.index;
      if (destinationIndex) {
        setRankedAttributes(state => {
          const arrCopy = Array.from(state);
          arrCopy.splice(
            destinationIndex,
            0,
            arrCopy.splice(sourceIndex, 1)[0],
          );
          return arrCopy;
        });
      }
    },
    [setRankedAttributes],
  );

  const handleAttributeInfoChange = useCallback(
    (key: Fields, value: BetterWhen, index: number) => {
      const updatedAttributesInfo = rankedAttributes.map((attribute, i) => {
        if (i === index) {
          return { ...attribute, [key]: value };
        }

        return attribute;
      });

      setRankedAttributes(updatedAttributesInfo);
    },
    [rankedAttributes, setRankedAttributes],
  );

  const handleEndOfRanking = useCallback(async () => {
    setIsLoading(true);
    const rankedAttributeNames = rankedAttributes.map(
      attribute => attribute.name,
    );

    const response = await fetch('/api/ahp/attributesPriotityTable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attributes: attributesNames,
        rankedAttributes: rankedAttributeNames,
      }),
    });
    const jsonResponse: number[][] = await response.json();

    setAttributesPrioritiesTable(jsonResponse);

    const newPrioritiesTypes = jsonResponse.map(row => {
      return row.map(col => {
        if (col < 1) {
          return 'inferior';
        }
        return 'superior';
      });
    });

    setPrioritiesTypes(newPrioritiesTypes);
    setIsLoading(false);
  }, [
    attributesNames,
    rankedAttributes,
    setAttributesPrioritiesTable,
    setPrioritiesTypes,
  ]);

  return (
    <Flex
      direction="column"
      bg="white"
      p="2"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-1">
          {droppableProvided => (
            <Flex
              direction="column"
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {rankedAttributes.map((attribute, i) => (
                <Draggable
                  key={`draggable-${attribute}-${attribute.index}`}
                  draggableId={`draggable-${attribute}[${attribute.index}]`}
                  index={i}
                >
                  {draggableProvided => (
                    <Flex
                      p="2"
                      alignItems="center"
                      bg="white"
                      borderBottom="1px solid"
                      borderBottomColor="gray.100"
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                    >
                      {/* <Text mr="4">{i + 1}º</Text> */}
                      <Box {...draggableProvided.dragHandleProps}>
                        <MdDragHandle />
                      </Box>
                      <Flex
                        flex="1"
                        ml="2"
                        alignItems={['flex-start', 'center']}
                        direction={['column', 'row']}
                        justifyContent="space-between"
                      >
                        <Tag>{attribute.name.toUpperCase()}</Tag>
                        <Flex alignItems="center">
                          <Text whiteSpace="nowrap" fontSize="sm">
                            melhor quando:
                          </Text>
                          <Select
                            ml="2"
                            size="sm"
                            variant="outline"
                            value={attribute.betterWhen}
                            onChange={e =>
                              handleAttributeInfoChange(
                                'betterWhen',
                                e.target.value as BetterWhen,
                                i,
                              )
                            }
                          >
                            <option value="greater">maior</option>
                            <option value="lesser">menor</option>
                          </Select>
                        </Flex>
                      </Flex>
                    </Flex>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </Flex>
          )}
        </Droppable>
      </DragDropContext>
      <Flex as="footer" justifyContent="center">
        <Button
          mt="4"
          w="32"
          h="8"
          fontSize="sm"
          display="flex"
          alignItems="center"
          onClick={handleEndOfRanking}
          disabled={isLoading}
          colorScheme="blue"
        >
          {isLoading ? <Spinner /> : 'Enviar dados'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default RankAttributes;
