import { useCallback, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { Flex } from '@chakra-ui/react';

import Data from './innerPages/dados';
import Priorities from './innerPages/prioridades';
import Results from './innerPages/resultado';

export type PageNames = 'data' | 'priorities' | 'results';

const Ahp: React.FC = () => {
  const [pagesNames, setPages] = useState<PageNames[]>(['data']);
  const [direction, setDirection] = useState<number>(1);

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
  );
};

export default Ahp;
