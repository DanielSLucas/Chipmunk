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
import { humanInputState } from '../../atoms/attributesAtom';
import { DataState } from '../../atoms/serializedDataAtom';
import { PageNames } from '../../pages/ahp';

type ResultsProps = {
  goToPage(pageName: PageNames): void;
};

const Results: React.FC<ResultsProps> = ({ goToPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [decision, setDecision] = useState<Record<string, any>>({});

  const data = useRecoilValue(DataState);
  const humanInput = useRecoilValue(humanInputState);

  useEffect(() => {
    const getDecision = async () => {
      const response = await fetch('/api/decide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          humanInput,
        }),
      });

      const jsonResponse = await response.json();

      return jsonResponse;
    };

    getDecision().then(response => {
      console.log(response);
      setDecision(response.decision);
    });

    setIsLoading(false);
  }, [humanInput, data]);

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
        mt="24"
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
                  {Object.keys(decision).map((key, i) => {
                    return <Th key={`${key}[${i}]`}>{key}</Th>;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                <Tr bg="green.100" color="green.800" fontWeight="bold">
                  {Object.keys(decision).map((key, i) => {
                    return (
                      <Td key={`${decision[key]}-[${i}]`}>{decision[key]}</Td>
                    );
                  })}
                </Tr>
              </Tbody>
            </Table>
          )}
        </Flex>

        <Flex as="footer" mt="8" justifyContent="flex-start">
          <Button onClick={handlePrevious} colorScheme="blue">
            <Icon mr="2" as={FiArrowLeft} h="6" w="6" />
            Prioridades
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Results;
