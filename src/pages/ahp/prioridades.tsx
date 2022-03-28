import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  attributesState,
  attributesPrioritiesState,
  humanInputState,
} from '../../atoms/attributesAtom';

import PrioritiesForm from '../../components/PrioritiesForm';
import RankAttributes from '../../components/RankAttributes';

const Priorities: React.FC = () => {
  const attributesPrioritiesTable = useRecoilValue(attributesPrioritiesState);
  const attributes = useRecoilValue(attributesState);
  const [, setHumanInput] = useRecoilState(humanInputState);

  const router = useRouter();

  const handlePrevious = useCallback(() => {
    router.push('/ahp');
  }, [router]);

  const handleNext = useCallback(() => {
    const attributesInfo = Array.from(attributes).sort(
      (a, b) => a.index - b.index,
    );

    setHumanInput({
      attributes: attributesInfo,
      attributesPrioritiesTable,
    });

    router.push('/ahp/resultado');
  }, [router, attributes, attributesPrioritiesTable, setHumanInput]);

  const isTheFormFilled = !attributesPrioritiesTable
    .map(row => {
      return row.includes(0);
    })
    .includes(true);

  return (
    <Flex flex="1" justifyContent="center">
      <Flex direction="column" borderRadius="md" p="2" mt="40" maxW="xl">
        <Flex as="header" direction="column">
          <Heading as="h2">Prioridades</Heading>
          <Text mt="2">
            Defina as prioridades de um parâmetro em relação a outro.
          </Text>
        </Flex>

        <Flex justify="center">
          <Accordion allowToggle mt="4" w={['18rem', 'md', 'xl']}>
            <AccordionItem>
              <h3>
                <AccordionButton bg="white">
                  <Box flex="1" textAlign="left">
                    Rakeamento de atributos
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4}>
                <RankAttributes />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h3>
                <AccordionButton bg="white">
                  <Box flex="1" textAlign="left">
                    Comparações detalhada entre atributos
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4}>
                <PrioritiesForm />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>

        <Flex as="footer" mt="8" justifyContent="space-between">
          <Button onClick={handlePrevious}>
            <Icon mr="2" as={FiArrowLeft} h="6" w="6" />
            Dados
          </Button>

          <Button onClick={handleNext} disabled={!isTheFormFilled}>
            Resultado
            <Icon ml="2" as={FiArrowRight} h="6" w="6" />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Priorities;
