import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

type IPriorityType = 'superior' | 'inferior';

type AttributePriorityFormProps = {
  attrb1: string;
  attrb2: string;
  coords: number[];
  value: string;
  priorityType: IPriorityType;
  setPriorityType(value: IPriorityType, coords: number[]): void;
  setPriority(
    coords: number[],
    value: string,
    priorityType: IPriorityType,
  ): void;
};

const AttributePriorityForm: React.FC<AttributePriorityFormProps> = ({
  attrb1,
  attrb2,
  coords,
  value,
  priorityType,
  setPriorityType,
  setPriority,
}) => {
  const handleValueChange = useCallback(
    (newValue: string) => {
      setPriority(coords, newValue, priorityType);
    },
    [coords, setPriority, priorityType],
  );

  const handlePriorityTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPriorityType(e.target.value as IPriorityType, coords);
      setPriority(coords, value, e.target.value as IPriorityType);
    },
    [value, coords, setPriority, setPriorityType],
  );

  return (
    <Flex
      direction="column"
      paddingY="2"
      borderBottom="solid"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text>
          <Tag>{attrb1.toUpperCase()}</Tag> é ________ em relação a{' '}
          <Tag>{attrb2.toUpperCase()}</Tag>
        </Text>

        <Box>
          <Select
            size="sm"
            variant="outline"
            value={priorityType}
            onChange={handlePriorityTypeChange}
          >
            <option value="superior">Superior</option>
            <option value="inferior">Inferior</option>
          </Select>
        </Box>
      </Flex>

      <RadioGroup onChange={handleValueChange} value={value} marginY="4">
        <Stack direction="row" spacing="24px">
          <Radio value="1" display="flex" flexDirection="column">
            <Text align="center" mt="2">
              igual
            </Text>
          </Radio>
          <Radio value="3" display="flex" flexDirection="column">
            <Text align="center" mt="2">
              pouco {priorityType}
            </Text>
          </Radio>
          <Radio value="5" display="flex" flexDirection="column">
            <Text align="center" mt="2">
              {priorityType}
            </Text>
          </Radio>
          <Radio value="7" display="flex" flexDirection="column">
            <Text align="center" mt="2">
              bem {priorityType}
            </Text>
          </Radio>
          <Radio value="9" display="flex" flexDirection="column">
            <Text align="center" mt="2">
              extremamente {priorityType}
            </Text>
          </Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
};

export default AttributePriorityForm;
