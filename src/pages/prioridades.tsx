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
} from '../atoms/attributesAtom';
import AttributesInfoForm from '../components/AttributesInfoForm';
import PrioritiesForm from '../components/PrioritiesForm';

const Priorities: React.FC = () => {
  const attributesPrioritiesTable = useRecoilValue(attributesPrioritiesState);
  const attributes = useRecoilValue(attributesState);
  const [, setHumanInput] = useRecoilState(humanInputState);

  const router = useRouter();

  const handlePrevious = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleNext = useCallback(() => {
    setHumanInput({
      attributes,
      attributesPrioritiesTable,
    });

    router.push('/resultado');
  }, [router, attributes, attributesPrioritiesTable, setHumanInput]);

  const isTheFormFilled = !attributesPrioritiesTable
    .map(row => {
      return row.includes(0);
    })
    .includes(true);

  return (
    <Flex flex="1" justifyContent="center" overflowY="hidden">
      <Flex direction="column" borderRadius="md" p="2" mt="40" maxW="xl">
        <Flex as="header" direction="column">
          <Heading as="h2">Prioridades</Heading>
          <Text mt="2">
            Defina as prioridades de um parâmetro em relação a outro.
          </Text>
        </Flex>

        <Accordion allowToggle mt="4" w="xl">
          <AccordionItem>
            <h3>
              <AccordionButton bg="white">
                <Box flex="1" textAlign="left">
                  Informações sobre os atributos
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <AttributesInfoForm />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h3>
              <AccordionButton bg="white">
                <Box flex="1" textAlign="left">
                  Comparações entre atributos
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <PrioritiesForm />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Flex as="footer" mt="8" w="xl" justifyContent="space-between">
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
