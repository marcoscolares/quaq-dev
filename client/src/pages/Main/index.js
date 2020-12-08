import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { shade } from "polished";

import socket from "../../services/socket";
import { useAuth } from "../../hooks/auth";

import LogoIncepa from "../../assets/logo-incepa.png";
import WelcomeIncepa from "../../assets/welcome-incepa.svg";

const Main = (props) => {
  const roomRef = useRef(null);
  const userRef = useRef(null);
  const userPasswordRef = useRef(null);
  const { signIn } = useAuth();

  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    socket.on("FE-error-user-exist", ({ error }) => {
      if (!error) {
        const roomName = roomRef.current.value;
        const userName = userRef.current.value;

        sessionStorage.setItem("user", userName);
        props.history.push(`/room/${roomName}`);
      } else {
        setErr(error);
        setErrMsg("Este nome de usuário já existe");
      }
    });
  }, [props.history]);

  async function clickJoin() {
    const roomName = roomRef.current.value;
    const userName = userRef.current.value;
    const userPasword = userPasswordRef.current.value;

    if (!roomName || !userName || !userPasword) {
      setErr(true);
      setErrMsg("Preencha corretamente os campos");
    } else {
      try {
        await signIn({ username: userName, password: userPasword });
        socket.emit("BE-check-user", { roomId: roomName, userName });
      } catch (err) {
        setErr(true);
        setErrMsg("Autenticação inválida.");
      }
    }
  }

  return (
    <Container>
      <Card>
        <Image src={LogoIncepa} />
        <Text>
          Seja bem-vindo ao ambiente de chamadas Quaq - Incepa. Acesse sua sala
          com suas devidas credenciais.
        </Text>
        <Input
          placeholder="Insira o nome da sala"
          id="roomName"
          ref={roomRef}
        />
        <Input
          placeholder="Insira o seu username Quaq"
          id="userName"
          ref={userRef}
        />
        <Input
          placeholder="Insira sua senha"
          id="userPassword"
          ref={userPasswordRef}
          type="password"
        />
        <Button onClick={clickJoin}>ACESSAR</Button>
        {err && <Error>{errMsg}</Error>}
      </Card>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: url(${WelcomeIncepa}) no-repeat center center fixed;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 522px;
  width: 545px;
  background: #f2f2f2;
  box-shadow: 0px 10px 14px #000000;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

export const Image = styled.img`
  width: 230px;
  height: 191px;
`;

export const Text = styled.div`
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #565656;
  padding: 10px 50px;
`;

export const Input = styled.input`
  width: 444px;
  height: 65px;
  background: #ffffff;
  border: 1px solid #dfdfdf;
  color: #333;
  box-sizing: border-box;
  padding: 20px;
  margin: 5px 0;
  font-size: 16px;

  :focus {
    outline-color: ${shade(0.2, "#dfdfdf")};
  }

  ::placeholder {
    color: #9e9e9e;
  }
`;

export const Button = styled.button`
  width: 172px;
  height: 53px;
  background: #9b4d24;
  border-radius: 4px;
  color: #ffffff;
  border: 0;
  cursor: pointer;
  margin: 10px 0;

  :hover {
    background: ${shade(0.2, "#9b4d24")};
  }
`;

export const Error = styled.div`
  color: #ee494a;
  font-size: 16px;
  margin: 10px;
`;

export default Main;
