/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */
import {
  Badge,
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
import { humanInputState } from '../../atoms/ahp/attributesAtom';
import { DataState } from '../../atoms/ahp/serializedDataAtom';
import { PageNames } from '../../pages/ahp';

type ResultsProps = {
  goToPage(pageName: PageNames): void;
};

type RecordData = {
  title: string;
  table?: (string | number)[][];
  calcs: string[];
};

const Results: React.FC<ResultsProps> = ({ goToPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [decision, setDecision] = useState<Record<string, any>>({});
  const [decisionPriority, setDecisionPriority] = useState<number>(0);
  const [records, setRecords] = useState<RecordData[]>([]);

  const data = useRecoilValue(DataState);
  const humanInput = useRecoilValue(humanInputState);

  useEffect(() => {
    const getDecision = async () => {
      const response = await fetch('/api/ahp/decide', {
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
      setRecords(response.records);
      setDecisionPriority(response.decisionPriority);
      setDecision(response.decision);
    });

    setIsLoading(false);
  }, [humanInput, data]);

  const handlePrevious = useCallback(() => {
    goToPage('priorities');
  }, [goToPage]);

  const handleDownload = useCallback(async () => {
    const response = await fetch('/api/ahp/generateAhpRecordsHtml', {
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
    downloadAnchor.download = 'calculosAhp.html';
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
          <Text mt="2">A melhor escolha com base no que você informou:</Text>
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
              <Text ml="2">
                Prioridade:{' '}
                <Badge
                  colorScheme={
                    decisionPriority > 50
                      ? 'green'
                      : decisionPriority < 20
                      ? 'red'
                      : 'gray'
                  }
                >
                  {decisionPriority}%
                </Badge>
              </Text>
              <Table variant="simple" size="sm" mt="4">
                <Thead>
                  <Tr bg="gray.100">
                    {Object.keys(decision).map((key, i) => {
                      return <Th key={`${key}[${i}]`}>{key}</Th>;
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    {Object.keys(decision).map((key, i) => {
                      return (
                        <Td key={`${decision[key]}-[${i}]`}>{decision[key]}</Td>
                      );
                    })}
                  </Tr>
                </Tbody>
              </Table>
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
            Prioridades
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Results;
