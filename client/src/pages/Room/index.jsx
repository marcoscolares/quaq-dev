import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import { useAuth } from "../../hooks/auth";

import socket from "../../services/socket";

import VideoCard from "../../components/Video";
import BottomBar from "../../components/BottomBar";
import Whishlist from "../../components/Whishlist";

import Logo from "../../components/Logo";

import { 
  Container, 
  VideoBox, 
  SecondaryVideoContainer, 
  CircleVideoBox, 
  SecondaryVideoContainerLeft, 
  UserNameMini,
  FaIcon
} from './styles';

// import Profile1 from '../../assets/fake-users/profile1.jpg'
// import Profile2 from '../../assets/fake-users/profile2.jpg'
// import mini1 from '../../assets/fake-users/mini1.jpg'
// import mini2 from '../../assets/fake-users/mini2.jpg'
// import mini3 from '../../assets/fake-users/mini3.jpg'
// import mini4 from '../../assets/fake-users/mini4.jpg'

const Room = (props) => {
  const { signOut } = useAuth();
  const currentUser = sessionStorage.getItem("user");
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

  useEffect(() => {
    // Set Back Button Event
    window.addEventListener("popstate", goToBack);

    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;

        socket.emit("BE-join-room", { roomId, userName: currentUser });
        socket.on("FE-user-join", (users) => {
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

        socket.on("FE-receive-call", ({ signal, from, info }) => {
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

        socket.on("FE-call-accepted", ({ signal, answerId }) => {
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });

        socket.on("FE-user-leave", ({ userId, userName }) => {
          const peerIdx = findPeer(userId);
          peerIdx.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
            return [...users];
          });
        });
      });

    socket.on("FE-toggle-camera", ({ userId, switchTarget }) => {
      const peerIdx = findPeer(userId);

      setUserVideoAudio((preList) => {
        let video = preList[peerIdx.userName].video;
        let audio = preList[peerIdx.userName].audio;

        if (switchTarget === "video") video = !video;
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
      socket.emit("BE-leave-room", { roomId, leaver: currentUser });
    };
  }, [currentUser, roomId]);

  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("BE-call-user", {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on("disconnect", () => {
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

    peer.on("signal", (signal) => {
      socket.emit("BE-accept-call", { signal, to: callerId });
    });

    peer.on("disconnect", () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  // BackButton
  const goToBack = async (e) => {
    e.preventDefault();
    socket.emit("BE-leave-room", { roomId, leaver: currentUser });
    window.location.href = "/";
    await signOut();
  };

  const toggleCameraAudio = (e) => {
    const target = e.target.getAttribute("data-switch");

    setUserVideoAudio((preList) => {
      let videoSwitch = preList["localUser"].video;
      let audioSwitch = preList["localUser"].audio;

      if (target === "video") {
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

    socket.emit("BE-toggle-camera-audio", { roomId, switchTarget: target });
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
                .find((track) => track.kind === "video"),
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
                  .find((track) => track.kind === "video"),
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

  function writeUserName(userName, index) {
    if (userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
        return <UserNameMini key={userName}>{userName}</UserNameMini>
      }
    }
  }

  function createMainUserVideo(peer, index, arr) {
    return (
      <VideoBox
        onClick={expandScreen}
        key={index}
      >
        {writeUserName(peer.userName)}
        <FaIcon className="fas fa-expand" />
        <VideoCard className="video" key={index} peer={peer} number={arr.length} />
      </VideoBox>
    );
    }

    function createSecondaryUserVideo(peer, index, arr) {
      return (
        <CircleVideoBox
          onClick={expandScreen}
          key={index}
        >
          {writeUserName(peer.userName)}
          <FaIcon className="fas fa-expand" />
          <VideoCard className="video" key={index} peer={peer} number={arr.length} />
        </CircleVideoBox>
      );
  }
  



  return (
    <Container>
      {peers && peers.map((peer, index, arr) => {
        if(index <= 1) {
          return createMainUserVideo(peer, index, arr)
        }
      })}
      

      {/* <VideoBox>
        <img className="video" alt="profile 1" src={Profile1} />
      </VideoBox>

      <VideoBox>
        <img className="video" alt="profile 2" src={Profile2} />
      </VideoBox> */}

      <SecondaryVideoContainer>
        
        <div className="content">
          {peers && peers.map((peer, index, arr) => {
            if(index > 1 && index <= 5) {
              return createSecondaryUserVideo(peer, index, arr)
            }})}
          {/* <CircleVideoBox>
          <img className="video" alt="mini 1" src={mini1} />
          <UserNameMini>@usuário</UserNameMini>
          </CircleVideoBox>
          
          
          <CircleVideoBox>
          <img className="video" alt="mini 2" src={mini2} />
          <UserNameMini>@usuário</UserNameMini>
          </CircleVideoBox>

          <CircleVideoBox>
          <img className="video" alt="mini 3" src={mini3} />
          <UserNameMini>@usuário</UserNameMini>
          </CircleVideoBox>

          <CircleVideoBox>
          <img className="video" alt="mini 4" src={mini4} />
          <UserNameMini>@usuário</UserNameMini>
          </CircleVideoBox> */}

        </div>

        
      </SecondaryVideoContainer>

      <SecondaryVideoContainerLeft>
        
        {/* <div className="content">
          <CircleVideoBox>
          <img className="video" alt="mini 1" src={mini1} />
          <UserNameMini>@usuário</UserNameMini>
          </CircleVideoBox>
          
          <CircleVideoBox>
          <img className="video" alt="mini 2" src={mini2} />
          <UserNameMini>@usuário</UserNameMini>
          </CircleVideoBox>

          <CircleVideoBox>
          <img className="video" alt="mini 3" src={mini3} />
          <UserNameMini>@usuário</UserNameMini>
          </CircleVideoBox>

          <CircleVideoBox>
          <img className="video" alt="mini 4" src={mini4} />
          <UserNameMini>@usuário</UserNameMini>
          </CircleVideoBox>

        </div> */}

        
      </SecondaryVideoContainerLeft>


      <BottomBar
        clickScreenSharing={clickScreenSharing}
        goToBack={goToBack}
        toggleCameraAudio={toggleCameraAudio}
        userVideoAudio={userVideoAudio['localUser']}
        screenShare={screenShare}
      />
      <Whishlist />
      <Logo />

    </Container>
  );
};

export default Room;
