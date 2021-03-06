/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
import { Flex, Text, Tag, Box, Select, Stack } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  attributesState,
  attributesNamesState,
} from '../atoms/ahp/attributesAtom';

type BetterWhen = 'greater' | 'lesser' | string;
type Fields = 'betterWhen' | 'name';

const AttributesInfoForm: React.FC = () => {
  const attributes = useRecoilValue(attributesNamesState);
  const [attributesInfo, setAttributesInfo] = useRecoilState(attributesState);

  useEffect(() => {
    if (attributesInfo.length === 0) {
      setAttributesInfo(
        attributes.map((attribute, i) => {
          return {
            index: i,
            name: attribute,
            betterWhen: 'greater',
          };
        }),
      );
    }
  }, []);

  const handleAttributeInfoChange = useCallback(
    (key: Fields, value: BetterWhen, index: number) => {
      const updatedAttributesInfo = attributesInfo.map((attribute, i) => {
        if (i === index) {
          return { ...attribute, [key]: value };
        }

        return attribute;
      });

      setAttributesInfo(updatedAttributesInfo);
    },
    [attributesInfo, setAttributesInfo],
  );

  return (
    <Flex
      direction="column"
      bg="white"
      p="4"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
    >
      <Stack spacing="16px">
        {attributesInfo.map((attribute, i) => (
          <Flex key={`${attribute}-[${i}]`} direction="row" alignItems="center">
            <Text>
              <Tag>{attribute.name.toUpperCase()}</Tag> é melhor quando:
            </Text>

            <Box ml="2">
              <Select
                size="sm"
                variant="outline"
                value={attribute.betterWhen}
                onChange={e =>
                  handleAttributeInfoChange(
                    'betterWhen',
                    e.target.value as BetterWhen,
                    i,
                  )
                }
              >
                <option value="greater">maior</option>
                <option value="lesser">menor</option>
              </Select>
            </Box>
          </Flex>
        ))}
      </Stack>
    </Flex>
  );
};

export default AttributesInfoForm;
