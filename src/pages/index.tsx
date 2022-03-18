/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  ListItem,
  Text,
  UnorderedList,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { FiArrowRight } from 'react-icons/fi';

type StatisticalMethod = {
  name: string;
  title: string;
  content: string;
  route: string;
};

const statisticalMethods = [
  {
    name: 'AHP',
    title: 'Análise hieráquica de processo',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit hic cumque, dicta facilis impedit corrupti sunt consequatur rerum, tempore quae repudiandae eligendi laborum minus nulla illum quaerat magni recusandae! Ipsa.',
    route: '/ahp',
  },
  {
    name: 'ANOVA',
    title: 'Análise de váriância',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit hic cumque, dicta facilis impedit corrupti sunt consequatur rerum, tempore quae repudiandae eligendi laborum minus nulla illum quaerat magni recusandae! Ipsa.',
    route: '/anova',
  },
  {
    name: 'Média',
    title: 'Média',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit hic cumque, dicta facilis impedit corrupti sunt consequatur rerum, tempore quae repudiandae eligendi laborum minus nulla illum quaerat magni recusandae! Ipsa.',
    route: '/media',
  },
  {
    name: 'Moda',
    title: 'Moda',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit hic cumque, dicta facilis impedit corrupti sunt consequatur rerum, tempore quae repudiandae eligendi laborum minus nulla illum quaerat magni recusandae! Ipsa.',
    route: '/moda',
  },
  {
    name: 'Mediana',
    title: 'Mediana',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit hic cumque, dicta facilis impedit corrupti sunt consequatur rerum, tempore quae repudiandae eligendi laborum minus nulla illum quaerat magni recusandae! Ipsa.',
    route: '/mediana',
  },
];

const Home: React.FC = () => {
  const router = useRouter();
  const [selectedStatisticalMethod, setSelectedStatisticalMethod] =
    useState<StatisticalMethod>(statisticalMethods[0]);

  const handleTestIt = useCallback(() => {
    router.push(selectedStatisticalMethod.route);
  }, [router, selectedStatisticalMethod]);

  return (
    <Flex flex="1" justifyContent="center" alignItems="center">
      <Flex w="4xl">
        {/* Left side */}
        <Flex as="section" direction="column">
          <Flex as="header" direction="column">
            <Heading as="h2">Métodos estatísticos disponíveis</Heading>
            <Text mt="6" align="justify">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit hic
              cumque, dicta facilis impedit corrupti sunt consequatur rerum,
              tempore quae repudiandae eligendi laborum minus nulla illum
              quaerat magni recusandae! Ipsa.
            </Text>
          </Flex>

          <Flex mt="6">
            {Array.from({
              length: Math.ceil(statisticalMethods.length / 5),
            }).map((_, i) => (
              <UnorderedList key={`statisticalMethod-${i + 1}`} mr="8">
                {statisticalMethods.slice(i * 5, i * 5 + 5).map(item => (
                  <ListItem key={item.name}>
                    <Link
                      as="button"
                      onClick={() => setSelectedStatisticalMethod(item)}
                      textDecor={
                        item.name === selectedStatisticalMethod.name
                          ? 'underline'
                          : ''
                      }
                    >
                      {item.name}
                    </Link>
                  </ListItem>
                ))}
              </UnorderedList>
            ))}
          </Flex>
        </Flex>

        <Box h="md" marginX="16" paddingY="6">
          <Divider borderColor="gray.400" orientation="vertical" />
        </Box>

        {/* Right side */}
        <Flex as="section" direction="column" justifyContent="center">
          <Flex as="article" direction="column">
            <Heading as="h3">{selectedStatisticalMethod.title}</Heading>
            <Text align="justify" mt="4">
              {selectedStatisticalMethod.content}
            </Text>
          </Flex>

          <Flex as="footer" mt="16" justifyContent="center">
            <Button onClick={handleTestIt}>
              Testar
              <Icon ml="2" as={FiArrowRight} h="6" w="6" />
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
