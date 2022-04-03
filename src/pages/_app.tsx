import type { AppProps } from 'next/app';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';

import '../app.css';
import Brand from '../components/Brand';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <Flex
          height="100vh"
          width="100vw"
          direction="column"
          bg="rgba(235,248,255,0.9)"
          bgImg="url(/chipmunkLogo.svg)"
          bgRepeat="no-repeat"
          bgPos="center"
        >
          <Brand />
          <Component {...pageProps} />
        </Flex>
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default MyApp;
