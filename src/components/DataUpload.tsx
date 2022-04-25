/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
import { Button, Flex, Icon, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiFileText } from 'react-icons/fi';

interface DataUploadProps {
  handleDataUpload(file: File): Promise<void>;
}

const DataUpload: React.FC<DataUploadProps> = ({ handleDataUpload }) => {
  const toast = useToast();
  const [file, setFile] = useState({} as File);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const handleUpload = useCallback(async () => {
    setIsLoading(true);
    try {
      await handleDataUpload(file);
    } catch (error: any) {
      toast({
        title: error.message,
        status: 'error',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [file, handleDataUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Flex direction="column" p="8" mt="4">
      <Flex direction="column" alignItems="center">
        <Flex
          {...getRootProps()}
          direction="column"
          alignItems="center"
          justifyContent="center"
          w={['18rem', 'md']}
          marginX="4"
          bg="rgba(255,255,255,0.9)"
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
          colorScheme="blue"
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
