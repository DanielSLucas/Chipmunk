/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
import React, { useCallback } from 'react';
import { Flex, Text, Icon, Button, Heading } from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import { PageNames } from '../../pages/ahp';
import { DataState } from '../../atoms/ahp/serializedDataAtom';
import {
  attributesNamesState,
  attributesPrioritiesState,
  prioritiesTypesState,
} from '../../atoms/ahp/attributesAtom';

import DataUpload from '../DataUpload';

type DataProps = {
  goToPage(pageName: PageNames): void;
};

const Data: React.FC<DataProps> = ({ goToPage }) => {
  const [data, setData] = useRecoilState(DataState);
  const [, setAttributesPriorities] = useRecoilState(attributesPrioritiesState);
  const [, setAttributesNames] = useRecoilState(attributesNamesState);
  const [, setPrioritiesTypes] = useRecoilState(prioritiesTypesState);
  const router = useRouter();

  const handlePrevious = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleNext = useCallback(() => {
    goToPage('priorities');
  }, [goToPage]);

  async function handleDataUpload(file: File): Promise<void> {
    const fileData = await file.text();

    const response = await fetch('/api/ahp/parseCsv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: fileData,
      }),
    });

    const jsonResponse: (string | number)[][] = await response.json();

    setData(jsonResponse);

    const attributes = jsonResponse[0].slice(
      1,
      jsonResponse[0].length,
    ) as string[];

    setAttributesNames(attributes);

    const initialAttributesPriorities = attributes.map((_item1, i) => {
      return attributes.map((_item2, j) => {
        if (i === j) return 1;
        return 0;
      });
    });

    setPrioritiesTypes(
      initialAttributesPriorities.map(row => row.map(() => 'superior')),
    );

    setAttributesPriorities(initialAttributesPriorities);
  }

  return (
    <Flex flex="1" justifyContent="center">
      <Flex
        direction="column"
        w="100%"
        borderRadius="md"
        p="2"
        mt="20"
        maxW="xl"
      >
        <Flex as="header" direction="column">
          <Heading as="h2">Dados</Heading>
          <Text mt="2">Insira um arquivo csv no seguinte formato:</Text>
        </Flex>

        <Flex justifyContent="center">
          <Text
            as="pre"
            p="4"
            mt="8"
            bg="rgba(255,255,255,0.9)"
            w="fit-content"
            borderRadius="sm"
          >
            ,preco,potencia{'\n'}moto1,10000,250{'\n'}moto2,8500,160
          </Text>
        </Flex>

        <DataUpload handleDataUpload={handleDataUpload} />

        <Flex as="footer" mt="4" justifyContent="space-between">
          <Button onClick={handlePrevious} colorScheme="blue">
            <Icon mr="2" as={FiArrowLeft} h="6" w="6" />
            Voltar
          </Button>

          <Button
            colorScheme="blue"
            onClick={handleNext}
            disabled={Object.keys(data).length === 0}
          >
            Prioridades
            <Icon ml="2" as={FiArrowRight} h="6" w="6" />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Data;
