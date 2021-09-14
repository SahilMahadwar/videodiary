import React, { useState, useCallback, useEffect } from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import Webcam from 'react-webcam';

export default function AllCameras() {
  const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState([]);

  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    <Box>
      <Box mt="100px" mx="auto" w="500px" h="500px">
        {devices.map((device, key) => (
          <Box>
            <Webcam
              audio={false}
              videoConstraints={{ deviceId: device.deviceId }}
            />
            <Box>{device.label || `Device ${key + 1}`}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// {devices.map((device, key) => (
//     <div>
//       <Webcam
//         audio={false}
//         videoConstraints={{ deviceId: device.deviceId }}
//       />
//       {device.label || `Device ${key + 1}`}
//     </div>
//   ))}
