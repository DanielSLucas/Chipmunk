/* eslint-disable jsx-a11y/anchor-is-valid */
import { Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Brand: React.FC = () => {
  return (
    <Flex as="header" width="100%" justifyContent="center" mt="2">
      <Flex
        w="6xl"
        paddingX="8"
        justifyContent="space-between"
        alignItems="center"
      >
        <Link href="/">
          <a>
            <Image src="/nameNslogan.png" width={150.4} height={62.4} />
          </a>
        </Link>
        <Text
          transitionProperty="color"
          transition="ease-in-out"
          transitionDuration="0.2s"
          sx={{
            '&:hover': {
              color: 'blue.200',
            },
          }}
        >
          <a href="mailto:daniellucas-pms@hotmail.com">Fale conosco</a>
        </Text>
      </Flex>
    </Flex>
  );
};

export default Brand;
