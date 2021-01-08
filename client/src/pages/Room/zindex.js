import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { useAuth } from '../../hooks/auth';

import socket from '../../services/socket';

import VideoCard from '../../components/Video';
import Videotable from '../../components/Videotable';
import BottomBar from '../../components/BottomBar';
import Whishlist from '../../components/Whishlist';

import Logo from '../../components/Logo';

import {
  Container,
  VideoBox,
  VideoBox2,
  VideoBox3,
  VideoBox4,
  VideoBox5,
  VideoBox6,
  VideoBox7,
  VideoBox8,
  VideoBox9,
  UserName,
  UserNameMini,
  FaIcon,
  Test,
  videoBoxCircleContainer,
  MainContainer,
} from './styles';

const Room = (props) => {
  const { signOut } = useAuth();
  const currentUser = sessionStorage.getItem('user');
  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [screenShare, setScreenShare] = useState(false);
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const screenTrackRef = useRef();
  const userStream = useRef();
  const roomId = props.match.params.roomId;

  const loop = [1, 2, 3];

  useEffect(() => {
    // Set Back Button Event
    window.addEventListener('popstate', goToBack);

    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;

        socket.emit('BE-join-room', { roomId, userName: currentUser });
        socket.on('FE-user-join', (users) => {
          // all users
          const peers = [];
          users.forEach(({ userId, info }) => {
            let { userName, video, audio } = info;

            if (userName !== currentUser) {
              const peer = createPeer(userId, socket.id, stream);

              peer.userName = userName;
              peer.peerID = userId;

              peersRef.current.push({
                peerID: userId,
                peer,
                userName,
              });
              peers.push(peer);

              setUserVideoAudio((preList) => {
                return {
                  ...preList,
                  [peer.userName]: { video, audio },
                };
              });
            }
          });

          setPeers(peers);
        });

        socket.on('FE-receive-call', ({ signal, from, info }) => {
          let { userName, video, audio } = info;
          const peerIdx = findPeer(from);

          if (!peerIdx) {
            const peer = addPeer(signal, from, stream);

            peer.userName = userName;

            peersRef.current.push({
              peerID: from,
              peer,
              userName: userName,
            });
            setPeers((users) => {
              return [...users, peer];
            });
            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
          }
        });

        socket.on('FE-call-accepted', ({ signal, answerId }) => {
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });

        socket.on('FE-user-leave', ({ userId, userName }) => {
          const peerIdx = findPeer(userId);
          peerIdx.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
            return [...users];
          });
        });
      });

    socket.on('FE-toggle-camera', ({ userId, switchTarget }) => {
      const peerIdx = findPeer(userId);

      setUserVideoAudio((preList) => {
        let video = preList[peerIdx.userName].video;
        let audio = preList[peerIdx.userName].audio;

        if (switchTarget === 'video') video = !video;
        else audio = !audio;

        return {
          ...preList,
          [peerIdx.userName]: { video, audio },
        };
      });
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    window.onbeforeunload = () => {
      socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    };
  }, [currentUser, roomId]);

  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-call-user', {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on('disconnect', () => {
      peer.destroy();
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-accept-call', { signal, to: callerId });
    });

    peer.on('disconnect', () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function writeUserName(userName) {
    // if (userVideoAudio.hasOwnProperty(userName)) {
    // if (!userVideoAudio[userName].video) {
    return <UserName key={userName}>{userName}</UserName>;
    // }
    // }
  }

  function createMainVideo(peer, index, arr) {
    if (peer === 1) {
      return (
        <>
          <VideoBox onClick={expandScreen} key={index}>
            {writeUserName(peer.userName)}
            <FaIcon className="fas fa-expand" />
          </VideoBox>
        </>
      );
    }
  }

  function createCircleVideos(peer, index, arr) {
    if (peer > 1) {
      return (
        <>
          <VideoBox2 onClick={expandScreen} key={index}>
            {writeUserName(peer.userName)}
            <FaIcon className="fas fa-expand" />
          </VideoBox2>
        </>
      );
    }
  }

  // BackButton
  const goToBack = async (e) => {
    e.preventDefault();
    socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    window.location.href = '/';
    await signOut();
  };

  const toggleCameraAudio = (e) => {
    const target = e.target.getAttribute('data-switch');

    setUserVideoAudio((preList) => {
      let videoSwitch = preList['localUser'].video;
      let audioSwitch = preList['localUser'].audio;

      if (target === 'video') {
        const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
        videoSwitch = !videoSwitch;
        userVideoTrack.enabled = videoSwitch;
      } else {
        const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
        audioSwitch = !audioSwitch;

        if (userAudioTrack) {
          userAudioTrack.enabled = audioSwitch;
        } else {
          userStream.current.getAudioTracks()[0].enabled = audioSwitch;
        }
      }

      return {
        ...preList,
        localUser: { video: videoSwitch, audio: audioSwitch },
      };
    });

    socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: target });
  };

  const clickScreenSharing = () => {
    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((stream) => {
          const screenTrack = stream.getTracks()[0];

          peersRef.current.forEach(({ peer }) => {
            // replaceTrack (oldTrack, newTrack, oldStream);
            peer.replaceTrack(
              peer.streams[0]
                .getTracks()
                .find((track) => track.kind === 'video'),
              screenTrack,
              userStream.current
            );
          });

          // Listen click end
          screenTrack.onended = () => {
            peersRef.current.forEach(({ peer }) => {
              peer.replaceTrack(
                screenTrack,
                peer.streams[0]
                  .getTracks()
                  .find((track) => track.kind === 'video'),
                userStream.current
              );
            });
            userVideoRef.current.srcObject = userStream.current;
            setScreenShare(false);
          };

          userVideoRef.current.srcObject = stream;
          screenTrackRef.current = screenTrack;
          setScreenShare(true);
        });
    } else {
      screenTrackRef.current.onended();
    }
  };

  const expandScreen = (e) => {
    const elem = e.target;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  return (
    <Container>
      <VideoBox></VideoBox>
      <VideoBox></VideoBox>

      <VideoBox2 onClick={expandScreen}>
        {writeUserName('nome')}
        <FaIcon className="fas fa-expand" />
      </VideoBox2>

      <VideoBox3 onClick={expandScreen}>
        {writeUserName('nome')}
        <FaIcon className="fas fa-expand" />
      </VideoBox3>

      <VideoBox4 onClick={expandScreen}>
        {writeUserName('nome')}
        <FaIcon className="fas fa-expand" />
      </VideoBox4>

      <VideoBox5 onClick={expandScreen}>
        {writeUserName('nome')}
        <FaIcon className="fas fa-expand" />
      </VideoBox5>

      <VideoBox6 onClick={expandScreen}>
        {writeUserName('nome')}
        <FaIcon className="fas fa-expand" />
      </VideoBox6>

      <VideoBox7 onClick={expandScreen}>
        {writeUserName('nome')}
        <FaIcon className="fas fa-expand" />
      </VideoBox7>

      <VideoBox8 onClick={expandScreen}>
        {writeUserName('nome')}
        <FaIcon className="fas fa-expand" />
      </VideoBox8>

      <VideoBox9 onClick={expandScreen}>
        {writeUserName('nome')}
        <FaIcon className="fas fa-expand" />
      </VideoBox9>

      <BottomBar
        clickScreenSharing={clickScreenSharing}
        goToBack={goToBack}
        toggleCameraAudio={toggleCameraAudio}
        userVideoAudio={userVideoAudio['localUser']}
        screenShare={screenShare}
      />
      <Whishlist />
      <Logo />
      <Videotable />
    </Container>

    //   <Container>
    // Current User Video

    //     {/* <VideoBox2>
    //       {userVideoAudio['localUser'].video ? null : <></>}
    //       <video ref={userVideoRef} muted autoPlay playsInline />
    //       <UserNameMini>@{currentUser}</UserNameMini>
    //     </VideoBox2> */}

    //     {/* Joined User Vidoe */}
    //     {/* {peers.length} */}
    //     <MainContainer>
    //       <VideoBox>
    //         {userVideoAudio['localUser'].video ? null : (
    //           <UserName>{currentUser}</UserName>
    //         )}
    //         <video ref={userVideoRef} muted autoPlay playsInline />
    //         {peers &&
    //           loop.map((peer, index, arr) => createMainVideo(peer, index, arr))}
    //       </VideoBox>
    //     </MainContainer>

    //     {peers &&
    //       loop.map((peer, index, arr) => createCircleVideos(peer, index, arr))}

    //     <videoBoxCircleContainer />

    //     <BottomBar
    //       clickScreenSharing={clickScreenSharing}
    //       goToBack={goToBack}
    //       toggleCameraAudio={toggleCameraAudio}
    //       userVideoAudio={userVideoAudio['localUser']}
    //       screenShare={screenShare}
    //     />
    //     <Whishlist />
    //     <Logo />
    //     <Videotable />
    //   </Container>
  );
};

export default Room;
