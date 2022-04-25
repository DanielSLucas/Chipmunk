/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Flex, Text, Icon, Button, Heading } from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/router';

import { SamplesState } from '../../atoms/anova/samplesAtom';
import { AnovaPageNames } from '../../pages/anova';

import DataUpload from '../DataUpload';

type DataProps = {
  goToPage(pageName: AnovaPageNames): void;
};

const Samples: React.FC<DataProps> = ({ goToPage }) => {
  const [samples, setSamples] = useRecoilState(SamplesState);

  const router = useRouter();

  const handlePrevious = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleNext = useCallback(() => {
    goToPage('results');
  }, [goToPage]);

  async function handleDataUpload(file: File): Promise<void> {
    const fileData = await file.text();

    const response = await fetch('/api/anova/getSamplesFromCsv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: fileData,
      }),
    });

    const jsonResponse = await response.json();

    setSamples(jsonResponse.samples);
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
          <Heading as="h2">Amostras</Heading>
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
            grupo1,grupo2,grupo3{'\n'}26,24,25{'\n'}28,26,23{'\n'}27,28,22
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
            disabled={Object.keys(samples).length === 0}
          >
            Resultados
            <Icon ml="2" as={FiArrowRight} h="6" w="6" />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Samples;
