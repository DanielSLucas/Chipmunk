/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
import { Button, Flex, Icon, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiFileText } from 'react-icons/fi';
import { useRecoilState } from 'recoil';
import {
  attributesPrioritiesState,
  attributesNamesState,
  prioritiesTypesState,
} from '../atoms/attributesAtom';

import { serializedDataState } from '../atoms/serializedDataAtom';

const DataUpload: React.FC = () => {
  const toast = useToast();
  const [file, setFile] = useState({} as File);
  const [, setSerializedData] = useRecoilState(serializedDataState);
  const [, setAttributesPriorities] = useRecoilState(attributesPrioritiesState);
  const [, setAttributesNames] = useRecoilState(attributesNamesState);
  const [, setPrioritiesTypes] = useRecoilState(prioritiesTypesState);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const handleUpload = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await file.text();

      const response = await fetch('/api/serializeData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
        }),
      });

      const jsonResponse = await response.json();

      setSerializedData(jsonResponse);

      const attributes = Object.keys(jsonResponse.attributesValues);
      attributes.shift();

      setAttributesNames(attributes);

      const initialAttributesPriorities = attributes.map((_item1, i) => {
        return attributes.map((_item2, j) => {
          if (i === j) return 1;
          return 0;
        });
      });

      setPrioritiesTypes(
        initialAttributesPriorities.map(row => row.map(() => 'superior')),
      );

      setAttributesPriorities(initialAttributesPriorities);
    } catch (error: any) {
      toast({
        title: error.message,
        status: 'error',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    file,
    setSerializedData,
    setAttributesPriorities,
    setPrioritiesTypes,
    setAttributesNames,
    toast,
  ]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Flex
      direction="column"
      // bg="white"
      p="8"
      // borderWidth="1px"
      // borderColor="gray.300"
      // borderRadius="md"
      mt="4"
    >
      <Flex direction="column" alignItems="center">
        <Flex
          {...getRootProps()}
          direction="column"
          alignItems="center"
          justifyContent="center"
          w={['18rem', 'md']}
          marginX="4"
          bg="gray.100"
          // mt="8"
          p="4"
          border="dashed"
          borderWidth="1px"
          borderColor="black"
          borderRadius="md"
        >
          <input {...getInputProps()} multiple={false} />

          <Icon as={FiFileText} h="8" w="8" />
          <Text>
            {isDragActive
              ? 'Solte o arquivo aqui...'
              : !file.name
              ? 'Solte o arquivo aqui, ou clique para selecionar o arquivo'
              : file.name}
          </Text>
        </Flex>
      </Flex>

      <Flex as="footer" justifyContent="center">
        <Button
          mt="4"
          mr="4"
          w="36"
          display="flex"
          alignItems="center"
          onClick={handleUpload}
          disabled={Object.keys(file).length === 0 || isLoading}
        >
          {isLoading ? <Spinner /> : 'Enviar dados'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default DataUpload;
