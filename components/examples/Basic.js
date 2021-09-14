import React from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

export default function Basic() {
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
  }, [webcamRef]);

  return (
    <Box>
      <Box mt="100px" mx="auto" w="500px" h="500px">
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
        <Button onClick={capture}>Capture photo</Button>
      </Box>
    </Box>
  );
}
