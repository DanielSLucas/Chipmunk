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
import SEO from '../components/SEO';

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
      'O processo hierárquico analítico (AHP) é uma técnica estruturada para organizar e analisar decisões complexas, baseadas em matemática e psicologia. O AHP ele auxilia nas tomadas de decisões, de modo a encontrar a decisão que melhor se adapte ao objetivo proposto. Este tipo de método é bastante utilizado em todo mundo numa variedade de situações de decisão, em áreas como negócios, saúde, educação etc. O AHP pode ser resumido em 5 etapas que são: Modelar o problema, estabelecer as prioridades, sintetizar os julgamentos, verificar a consistência desses julgamentos, e chegar na decisão final.',
    route: '/ahp',
  },
  {
    name: 'ANOVA',
    title: 'Análise de variância',
    content:
      'A Análise de Variância (ANOVA) é um teste estatístico que como visão fundamental verificar se existe uma diferença significativa entre as médias de três ou mais amostras independentes e se elas exercem influência em alguma variável dependente. ANOVA auxilia empresas em tratamentos de dados, por exemplo, em uma pesquisa de satisfação, se faz a comparação de vários grupos diferentes de pessoas e comparando suas medias, tentando chegar no satisfatório definido pela empresa ou falhando o processo.',
    route: '/anova',
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
    <>
      <SEO
        title="Chipmunk"
        description="Até um esquilo escolhe as melhores nozes"
        shouldExludeTitleSuffix
      />
      <Flex
        flex="1"
        justifyContent="center"
        alignItems="center"
        overflowY="auto"
      >
        <Flex
          w="6xl"
          h="md"
          direction={['column', 'column', 'row']}
          paddingX="8"
          justifyContent={['center', 'center', 'normal']}
          alignItems={['center', 'center', 'normal']}
          sx={{
            '@media (max-width: 375px)': {
              paddingTop: '20rem',
            },
          }}
        >
          {/* Left side */}
          <Flex maxW="md" as="section" direction="column">
            <Flex as="header" direction="column">
              <Heading as="h2">Métodos estatísticos disponíveis</Heading>
              <Text mt="6" align="justify">
                Escolha o método estatístico, forneça as informações solicitadas
                e com alguns clicks obtenha os resultados e cálculos desejados.
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
                        textDecorationColor="blue.600"
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

          <Box
            sx={{
              '@media (max-width: 770px)': {
                display: 'none',
              },
            }}
            h="md"
            marginX={['4', '8', '16']}
            paddingY="6"
          >
            <Divider borderColor="gray.400" orientation="vertical" />
          </Box>

          {/* Right side */}
          <Flex
            maxW="md"
            as="section"
            direction="column"
            justifyContent="center"
            mt={['6', '6', '0']}
          >
            <Flex as="article" direction="column">
              <Heading as="h3">{selectedStatisticalMethod.title}</Heading>
              <Text align="justify" mt="4">
                {selectedStatisticalMethod.content}
              </Text>
            </Flex>

            <Flex as="footer" mt="16" justifyContent="center">
              <Button onClick={handleTestIt} colorScheme="blue">
                Testar
                <Icon ml="2" as={FiArrowRight} h="6" w="6" />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
