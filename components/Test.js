import React, { useState, useCallback, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';

import {
  Box,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

export default function AllCameras() {
  const [deviceId, setDeviceId] = useState({});
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
    deviceId: deviceId,
  };

  const handleVideoDevices = useCallback(
    (mediaDevices) =>
      setVideoDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
    [setVideoDevices]
  );

  const handleAudioDevices = useCallback(
    (mediaDevices) =>
      setAudioDevices(mediaDevices.filter(({ kind }) => kind === 'audioinput')),
    [setAudioDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleVideoDevices);
    navigator.mediaDevices.enumerateDevices().then(handleAudioDevices);
  }, [handleVideoDevices, handleAudioDevices]);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      console.log(blob);
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'react-webcam-stream-capture.webm';

      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <Box>
      <Box mt="100px" mx="auto" w="500px" h="500px">
        <Flex borderRadius="8px" overflow="hidden">
          <Webcam
            audio={true}
            ref={webcamRef}
            videoConstraints={videoConstraints}
          />
        </Flex>
        <Flex mt="20px" w="100%" justify="space-between">
          <Menu>
            <MenuButton id="1" as={Button} rightIcon={<ChevronDownIcon />}>
              Select Camera
            </MenuButton>
            <MenuList>
              {videoDevices.map((device, key) => (
                <MenuItem
                  key={key}
                  onClick={() => setDeviceId(device.deviceId)}
                >
                  {device.label || `Device ${key + 1}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select microphone
            </MenuButton>
            <MenuList>
              {audioDevices.map((device, key) => (
                <MenuItem key={key}>
                  {device.label || `Device ${key + 1}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
        <Flex justify="space-between" w="100%" mt="20px">
          {capturing ? (
            <Button onClick={handleStopCaptureClick}>Stop Recording</Button>
          ) : (
            <Button onClick={handleStartCaptureClick}>Start Recording</Button>
          )}

          {recordedChunks.length > 0 && (
            <Button onClick={handleDownload}>Download</Button>
          )}
        </Flex>
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
