/* eslint-disable react/no-array-index-key */
import {
  Button,
  Flex,
  Heading,
  Icon,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useRecoilValue } from 'recoil';
import { humanInputState } from '../atoms/attributesAtom';
import { serializedDataState } from '../atoms/serializedDataAtom';

const Results: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [decision, setDecision] = useState<Record<string, string | number>>({});

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

    getDecision().then(response => setDecision(response));
    setIsLoading(false);
  }, [humanInput, serializedData]);

  const handlePrevious = useCallback(() => {
    router.push('/prioridades');
  }, [router]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Flex flex="1" justifyContent="center">
      <Flex
        direction="column"
        h="100%"
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

        <Flex direction="column" bg="white" p="4" mt="4" borderRadius="md">
          <Heading as="h3">{decision[Object.keys(decision)[0]]}</Heading>
          {isLoading ? (
            <Spinner />
          ) : (
            <Stack mt="4" spacing="8px">
              {Object.keys(decision).map((key, i) => {
                if (i === 0) {
                  return null;
                }
                return (
                  <Flex alignItems="center" key={`${key}-[${i}]`}>
                    <Text fontWeight="medium">{key}:</Text>
                    <Text ml="2"> {decision[key]}</Text>
                  </Flex>
                );
              })}
            </Stack>
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
