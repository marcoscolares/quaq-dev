import React from "react";
import styled from "styled-components";
import {
  FaDesktop,
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
} from "react-icons/fa";

const BottomBar = ({
  goToBack,
  toggleCameraAudio,
  userVideoAudio,
  clickScreenSharing,
  screenShare,
}) => {
  return (
    <Container>
      <Button onClick={clickScreenSharing}>
        <FaDesktop size={25} color="#BD5219" />
      </Button>

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

      <Button onClick={goToBack}>
        <FaPhoneSlash size={25} color="#BD5219" />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  right: 0;
  bottom: 20px;
  width: 100%;
`;

const Button = styled.div`
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(13.3495px);
  width: 70px;
  height: 70px;
  border-radius: 35px;

  :hover {
    cursor: pointer;
  }
`;

const CameraButton = styled.div`
width: 70px;
height: 70px;
align-items: center;
justify-content: center;
  display: flex;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 35px;
  margin-top: 10%;


  :hover {
    cursor: pointer;
  }

  * {
    pointer-events: none;
  }
`;

const AudioButton = styled.div`
width: 70px;
height: 70px;
align-items: center;
justify-content: center;
  display: flex;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 35px;
  margin-top: 10%;
  margin-left: 2%;


  :hover {
    cursor: pointer;
  }

  * {
    pointer-events: none;
  }
`;

export default BottomBar;
