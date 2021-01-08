import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  right: 0;
  bottom: 150px;
  width: 100%;
  /* background: red; */
`;

export const CameraButton = styled.div`
  position: absolute;
  top: -2.5vh;
  right: 53vw;

  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
  display: flex;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  backdrop-filter: blur(13.3495px);

  :hover {
    cursor: pointer;
  }

  * {
    pointer-events: none;
  }
`;

export const AudioButton = styled.div`
  position: absolute;
  top: -2.5vh;
  left: 53vw;

  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
  display: flex;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  backdrop-filter: blur(13.3495px);

  :hover {
    cursor: pointer;
  }

  * {
    pointer-events: none;
  }
`;

export const CloseCall = styled.div`
  position: absolute;
  top: 5vh;

  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
  display: flex;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  backdrop-filter: blur(13.3495px);
  :hover {
    cursor: pointer;
  }

  * {
    pointer-events: none;
  }
`;

export const ScreenShare = styled.div`
  position: absolute;
  top: -10vh;

  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
  display: flex;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  backdrop-filter: blur(13.3495px);
  :hover {
    cursor: pointer;
  }

  * {
    pointer-events: none;
  }
`;
