import { useCallback, useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import { Flex } from '@chakra-ui/react';

import Data from './innerPages/dados';
import Priorities from './innerPages/prioridades';
import Results from './innerPages/resultado';

export type PageNames = 'data' | 'priorities' | 'results';

const Ahp: React.FC = () => {
  const changeVisiblePage = useCallback((pageName: PageNames) => {
    setPages([pageName]);
  }, []);

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

  const [pagesNames, setPages] = useState<PageNames[]>([]);
  const transitions = useTransition(pagesNames, {
    from: {
      opacity: 0,
      position: 'absolute',
      top: '-100%',
    },
    enter: {
      opacity: 1,
      position: 'absolute',
      top: '0',
    },
    leave: {
      opacity: 0,
      position: 'absolute',
      top: '100%',
    },
    delay: 500,
  });

  useEffect(() => {
    setPages(['data']);
  }, []);

  return (
    <Flex
      flex="1"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {transitions((styles, page) => (
        <animated.div style={styles}>{getPage(page)}</animated.div>
      ))}
    </Flex>
  );
};

export default Ahp;
