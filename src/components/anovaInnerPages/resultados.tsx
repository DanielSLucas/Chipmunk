/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
import {
  Badge,
  Box,
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
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { useRecoilValue } from 'recoil';

import { SamplesState } from '../../atoms/anova/samplesAtom';
import { AnovaPageNames } from '../../pages/anova';

type ResultsProps = {
  goToPage(pageName: AnovaPageNames): void;
};

type AnovaTableItem = {
  between: number;
  within: number;
  total: number;
};

type AnovaTable = {
  sumOfSquares: AnovaTableItem;
  degreesOfFreedom: AnovaTableItem;
  squaresMeans: Omit<AnovaTableItem, 'total'>;
  fStatistic: number;
  fdistribution: number;
  isApproved: boolean;
};

type RecordData = {
  title: string;
  table?: (string | number)[][];
  calcs: string[];
};

const Results: React.FC<ResultsProps> = ({ goToPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const samples = useRecoilValue(SamplesState);
  const [anovaTable, setAnovaTable] = useState<AnovaTable | undefined>(
    undefined,
  );
  const [records, setRecords] = useState<RecordData[]>([]);

  useEffect(() => {
    const getDecision = async () => {
      const response = await fetch('/api/anova/anova', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          samples,
          alpha: '5%',
        }),
      });

      const jsonResponse = await response.json();

      return jsonResponse;
    };

    getDecision().then(({ records: anovaCalcs, ...table }) => {
      setRecords(anovaCalcs);
      setAnovaTable(table);
    });

    setIsLoading(false);
  }, [samples]);

  const handlePrevious = useCallback(() => {
    goToPage('samples');
  }, [goToPage]);

  const handleDownload = useCallback(async () => {
    const response = await fetch('/api/anova/generateAnovaRecordsHtml', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: records,
      }),
    });

    const jsonResponse = await response.json();

    const html = new Blob([jsonResponse.recordsAsHtml], { type: 'text/html' });

    const htmlUrl = window.URL.createObjectURL(html);

    window.open(htmlUrl, 'blank');

    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = htmlUrl;
    downloadAnchor.download = 'calculosAnova.html';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    window.URL.revokeObjectURL(htmlUrl);
  }, [records]);

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
        </Flex>

        <Flex
          direction="column"
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
            <>
              <Box>
                <Badge colorScheme={anovaTable?.isApproved ? 'green' : 'red'}>
                  {anovaTable?.isApproved ? 'Aprovado' : 'Reprovado'}
                </Badge>
                <Badge ml="2">Alpha = 5%</Badge>
              </Box>
              <Table variant="simple" size="sm" mt="4">
                <Thead>
                  <Tr bg="gray.100">
                    <Th>FV</Th>
                    <Th>SQ</Th>
                    <Th>GL</Th>
                    <Th>QM</Th>
                    <Th>F</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Th bg="gray.100">E</Th>
                    <Td>{anovaTable?.squaresMeans.between.toFixed(2)}</Td>
                    <Td>{anovaTable?.degreesOfFreedom.between.toFixed(2)}</Td>
                    <Td>{anovaTable?.squaresMeans.between.toFixed(2)}</Td>
                    <Td>{anovaTable?.fStatistic.toFixed(2)}</Td>
                  </Tr>

                  <Tr>
                    <Th bg="gray.100">D</Th>
                    <Td>{anovaTable?.squaresMeans.within.toFixed(2)}</Td>
                    <Td>{anovaTable?.degreesOfFreedom.within.toFixed(2)}</Td>
                    <Td>{anovaTable?.squaresMeans.within.toFixed(2)}</Td>
                    <Td />
                  </Tr>
                </Tbody>
              </Table>

              <Flex paddingX="2">
                <Box display="flex" alignItems="center">
                  <Badge colorScheme="blue">{anovaTable?.fdistribution}</Badge>
                </Box>
                <Box ml="2" mt="1">
                  <Text color="GrayText" fontSize="sm">
                    Distribuição F de Fisher-Snedecor para grau de liberdade
                    entre igual a {anovaTable?.degreesOfFreedom.between} e grau
                    de liberdade dentre igual a{' '}
                    {anovaTable?.degreesOfFreedom.within}
                  </Text>
                </Box>
              </Flex>

              <Button mt="4" onClick={handleDownload} colorScheme="blue">
                <Icon mr="2" as={FiDownload} h="6" w="6" />
                Cálculos
              </Button>
            </>
          )}
        </Flex>

        <Flex as="footer" mt="8" justifyContent="flex-start">
          <Button onClick={handlePrevious} colorScheme="blue">
            <Icon mr="2" as={FiArrowLeft} h="6" w="6" />
            Amostras
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Results;
