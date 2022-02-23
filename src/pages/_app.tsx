import type { AppProps } from 'next/app';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';

import '../app.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <Flex height="100vh" width="100vw" direction="column" bg="gray.200">
          <Component {...pageProps} />
        </Flex>
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default MyApp;
