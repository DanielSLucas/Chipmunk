import { useCallback, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { Flex } from '@chakra-ui/react';

import Samples from '../components/anovaInnerPages/amostras';
import Results from '../components/anovaInnerPages/resultados';
import SEO from '../components/SEO';

export type AnovaPageNames = 'samples' | 'results';

const Anova: React.FC = () => {
  const [pagesNames, setPages] = useState<AnovaPageNames[]>(['samples']);
  // 1 = pages goes down | -1 = pages goes up
  const [direction, setDirection] = useState<number>(1);

  // changes to the page passed in the params
  const changeVisiblePage = useCallback((pageName: AnovaPageNames) => {
    const targetPage = pageName;
    let newDirection = 1;

    if (targetPage === 'samples') {
      newDirection = -1;
    }

    setDirection(newDirection);
    setPages([pageName]);
  }, []);

  // Returns the right component based on page name
  const getPage = useCallback(
    (pageName: AnovaPageNames) => {
      const components = {
        samples: <Samples goToPage={changeVisiblePage} />,
        results: <Results goToPage={changeVisiblePage} />,
      };

      return components[pageName] || components.samples;
    },
    [changeVisiblePage],
  );

  // animatiosn
  const transitions = useTransition(pagesNames, {
    from: {
      opacity: 0,
      top: `${-100 * direction}%`,
    },
    enter: {
      opacity: 1,
      top: '0',
    },
    leave: {
      opacity: 0,
      top: `${100 * direction}%`,
    },
    delay: 500,
  });

  return (
    <>
      <SEO title="ANOVA" description="Análise de variância" />
      <Flex
        flex="1"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        {transitions((styles, page) => (
          <animated.div
            style={{
              opacity: styles.opacity,
              position: 'absolute',
              top: styles.top,
            }}
          >
            {getPage(page)}
          </animated.div>
        ))}
      </Flex>
    </>
  );
};

export default Anova;
