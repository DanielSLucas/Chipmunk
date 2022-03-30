/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
import {
  Button,
  Flex,
  Heading,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import React, { useCallback, useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useRecoilValue } from 'recoil';
import { humanInputState } from '../../../atoms/attributesAtom';
import { serializedDataState } from '../../../atoms/serializedDataAtom';
import { PageNames } from '..';

type DecisionItem = {
  priority: number;
  isTheBestDecision: boolean;
  [key: string]: any;
};

type ResultsProps = {
  goToPage(pageName: PageNames): void;
};

const Results: React.FC<ResultsProps> = ({ goToPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [decision, setDecision] = useState<DecisionItem[]>([]);
  const [decisionItemAttributes, setDecisionItemAttributes] = useState<
    string[]
  >([]);

  const serializedData = useRecoilValue(serializedDataState);
  const humanInput = useRecoilValue(humanInputState);

  useEffect(() => {
    const getDecision = async () => {
      const response = await fetch('/api/decide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serializedData,
          humanInput,
        }),
      });

      const jsonResponse = await response.json();

      return jsonResponse;
    };

    const getObjAttributes = (arr: any[]) => {
      const attribs = Object.keys(arr[0]);

      const priorityAttIndex = attribs.findIndex(
        attrib => attrib === 'priority',
      );

      attribs.splice(priorityAttIndex, 1);

      return ['priority', ...attribs];
    };

    getDecision().then(response => {
      setDecisionItemAttributes(getObjAttributes(response));
      setDecision(response);
    });

    setIsLoading(false);
  }, [humanInput, serializedData]);

  const handlePrevious = useCallback(() => {
    goToPage('priorities');
  }, [goToPage]);

  return (
    <Flex flex="1" justifyContent="center">
      <Flex
        direction="column"
        w="100%"
        borderRadius="md"
        p="2"
        mt="40"
        maxW="xl"
      >
        <Flex as="header" direction="column">
          <Heading as="h2">Resultado</Heading>
          <Text mt="2">A melhor escolha com base no que você informou:</Text>
        </Flex>

        <Flex
          bg="white"
          p="2"
          mt="4"
          borderRadius="md"
          w="100%"
          position="relative"
          overflow="auto"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {decisionItemAttributes.map((attribute, i) => {
                    if (attribute === 'isTheBestDecision') return null;

                    return <Th key={`${attribute}[${i}]`}>{attribute}</Th>;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {decision.map((item, i) => {
                  return (
                    <Tr
                      bg={item.isTheBestDecision ? 'green.100' : 'inherit'}
                      color={item.isTheBestDecision ? 'green.800' : 'inherit'}
                      fontWeight={item.isTheBestDecision ? 'bold' : 'inherit'}
                      key={`${item}-[${i}]`}
                    >
                      {decisionItemAttributes.map((attribute, j) => {
                        if (attribute === 'isTheBestDecision') return null;

                        const value =
                          attribute === 'priority'
                            ? `${Number(item[attribute] * 100).toFixed(2)}%`
                            : item[attribute];

                        return (
                          <Td
                            key={`${item}[${attribute}]-[${i}][${j}]`}
                            isNumeric={Number.isInteger(value)}
                          >
                            {value}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
        </Flex>

        <Flex as="footer" mt="8" justifyContent="flex-start">
          <Button onClick={handlePrevious}>
            <Icon mr="2" as={FiArrowLeft} h="6" w="6" />
            Prioridades
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Results;
