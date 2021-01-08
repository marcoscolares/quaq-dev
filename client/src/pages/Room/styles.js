import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;

  /* background: red; */
  align-items: center;
  justify-content: space-between;
`;

export const VideoBox = styled.div`
  display: flex;
  height: 100vh;
  width: 50vw;
  /* background: blue; */

  .video {
    flex: 1;
    object-fit: cover;
  }
`;

export const SecondaryVideoContainer = styled.div`
  display: flex;
  align-items: justify-content;
  position: absolute;
  width: 50vw;
  padding: 40px;
  /* background: red; */
  bottom: 0;

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 100%;
    width: 30vw;
    /* background: green; */
  }

  border-left: 120px solid transparent;
  border-right: 120px solid transparent;
  border-bottom: 80px solid rgba(255, 255, 255, 0.8);
`;

export const SecondaryVideoContainerLeft = styled(SecondaryVideoContainer)`
  left: 50%;

  .content {
    flex-direction: row-reverse;
    width: 30vw;
  }
`;

export const CircleVideoBox = styled.div`
  width: 40px;
  height: 40px;

  .video {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    border: 1px solid #ae4f1e;
  }
`;

export const UserNameMini = styled.div`
  margin-top: 10px;
  display: flex;
  width: 85px;
  align-items: center;
  text-align: center;
  font-size: 16px;
  z-index: 1;
  color: #4a4a4a;
  /* background: red; */
  position: absolute;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

export const FaIcon = styled.i`
  display: none;
  position: absolute;
  right: 15px;
  top: 15px;
`;
