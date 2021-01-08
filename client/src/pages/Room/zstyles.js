import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: red;
`;

export const VideoBox = styled.div`
  border: 1px solid #222;
  background-color: green;
  width: 50%;
  height: 100%;

  video {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
  }
`;

export const VideoBox2 = styled.div`
  border: 4px solid #ae4f1e;
  position: absolute;
  width: 6%;
  height: 13%;
  border-radius: 100%;
  left: 5%;
  bottom: 50px;
  z-index: 1;
  background-color: blue;

  video {
    border-radius: 100%;
    width: 100%;
    height: 100%;
    border: #ae4f1e solid 4px;
    object-fit: cover;
  }
`;

export const VideoBox3 = styled(VideoBox2)`
  left: 14%;
`;

export const VideoBox4 = styled(VideoBox2)`
  left: 23%;
`;

export const VideoBox5 = styled(VideoBox2)`
  left: 32%;
`;

export const VideoBox6 = styled(VideoBox2)`
  left: auto;
  right: 5%;
`;

export const VideoBox7 = styled(VideoBox2)`
  left: auto;
  right: 14%;
`;

export const VideoBox8 = styled(VideoBox2)`
  left: auto;
  right: 23%;
`;

export const VideoBox9 = styled(VideoBox2)`
  left: auto;
  right: 32%;
`;

export const UserName = styled.div`
  position: absolute;
  color: #000000;
  width: 100%;
  text-align: center;
  bottom: -30px;
  font-size: calc(10px + 1vmin);
  z-index: 1;
`;

export const UserNameMini = styled.div`
  position: bottom;
  font-size: 14.5px;
  z-index: 1;
  top: 105%;
  left: 7%;
`;

export const FaIcon = styled.i`
  display: none;
  position: absolute;
  right: 15px;
  top: 15px;
`;

export const Test = styled.div`
  width: 100px;
  height: 100px;
  background-color: #fff;
`;

export const videoBoxCircleContainer = styled.div`
  width: 100px;
  height: 100px;
  background-color: #fff;
  border-radius: 30px;
`;

export const MainContainer = styled.div`
  height: 50vh;
  width: 100vw;
  background-color: #fff;
  /* display: flex; */
  /* flex-direction: row; */
`;
