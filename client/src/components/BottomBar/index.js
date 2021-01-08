import React from 'react';
import styled from 'styled-components';

import {
  Container,
  CameraButton,
  AudioButton,
  CloseCall,
  ScreenShare,
} from './styles';

import {
  FaDesktop,
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
} from 'react-icons/fa';

const BottomBar = ({
  goToBack,
  toggleCameraAudio,
  userVideoAudio,
  clickScreenSharing,
  screenShare,
}) => {
  return (
    <Container>
      <ScreenShare onClick={clickScreenSharing}>
        <FaDesktop size={25} color="#BD5219" />
      </ScreenShare>

      <CameraButton onClick={toggleCameraAudio} data-switch="video">
        {userVideoAudio.video ? (
          <FaVideo size={25} color="#BD5219" />
        ) : (
          <FaVideoSlash size={25} color="#BD5219" />
        )}
      </CameraButton>

      <AudioButton onClick={toggleCameraAudio} data-switch="audio">
        {userVideoAudio.audio ? (
          <FaMicrophone size={25} color="#BD5219" />
        ) : (
          <FaMicrophoneSlash size={25} color="#BD5219" />
        )}
      </AudioButton>

      <CloseCall onClick={goToBack}>
        <FaPhoneSlash size={25} color="#BD5219" />
      </CloseCall>
    </Container>
  );
};

export default BottomBar;
