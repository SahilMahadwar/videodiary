import React from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import Basic from '../components/examples/Basic';
import AllCameras from '../components/examples/AllCameras';
import Test from '../components/Test';

export default function Home() {
  return (
    <Box>
      <Box mt="100px" mx="auto" w="500px" h="500px">
        <Test />
      </Box>
    </Box>
  );
}
