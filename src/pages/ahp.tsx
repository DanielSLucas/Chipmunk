import { useCallback, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { Flex } from '@chakra-ui/react';

import Data from '../components/ahpInnerPages/dados';
import Priorities from '../components/ahpInnerPages/prioridades';
import Results from '../components/ahpInnerPages/resultado';

export type PageNames = 'data' | 'priorities' | 'results';

const Ahp: React.FC = () => {
  const [pagesNames, setPages] = useState<PageNames[]>(['data']);
  // 1 = pages goes down | -1 = pages goes up
  const [direction, setDirection] = useState<number>(1);

  // changes to the page passed in the params
  const changeVisiblePage = useCallback(
    (pageName: PageNames) => {
      const currentPage = pagesNames[0];
      const targetPage = pageName;
      let newDirection = 1;

      if (
        targetPage === 'data' ||
        (targetPage === 'priorities' && currentPage === 'results')
      ) {
        newDirection = -1;
      }

      setDirection(newDirection);
      setPages([pageName]);
    },
    [pagesNames],
  );

  // Returns the right component based on page name
  const getPage = useCallback(
    (pageName: PageNames) => {
      const components = {
        data: <Data goToPage={changeVisiblePage} />,
        priorities: <Priorities goToPage={changeVisiblePage} />,
        results: <Results goToPage={changeVisiblePage} />,
      };

      return components[pageName] || components.data;
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
    <Flex
      flex="1"
      justifyContent="center"
      position="relative"
      // overflow="hidden"
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
  );
};

export default Ahp;
