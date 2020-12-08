import React, { useState, Fragment, useEffect } from "react";
import { useAuth } from "../../hooks/auth";
import styled from "styled-components";
import { FaHeart, FaTimes } from "react-icons/fa";
import socketIOClient from "socket.io-client";
import api from "../../services/api";

import BackgroundIncepa from "../../assets/backgroundIncepa.png";

function Whishlist() {
  const [open, setOpen] = useState(false);
  const [whishlist, setWhishlist] = useState([]);
  const { token } = useAuth();

  async function handleWhishlist() {
    const response = await api.get("/whishlist/roca");
    setWhishlist(response.data);
  }

  useEffect(() => {
    handleWhishlist();

    const socket = socketIOClient.connect("https://api.quaq.dev", {
      query: {
        token,
      },
    });
    socket.on("update-whishlist", () => {
      handleWhishlist();
    });
  }, [token]);

  return (
    <Fragment>
      <Button onClick={() => setOpen(!open)}>
        {open ? (
          <FaTimes size={20} color="#ffffff" />
        ) : (
          <FaHeart size={20} color="#ffffff" />
        )}
      </Button>
      <Card open={open}>
        <CardHeader>Lista de favoritos</CardHeader>
        <Items>
          {whishlist.map((item, index) => (
            <Item key={index}>
              <ItemImage src={item.images[0]} />
              <ItemText>{item.description}</ItemText>
            </Item>
          ))}
        </Items>
      </Card>
    </Fragment>
  );
}

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  position: absolute;
  top: 30px;
  right: 30px;
  opacity: 1;
  background: linear-gradient(41.74deg, #9b4d24 -5.37%, #bd5219 132.05%);
  box-shadow: 0px 3.33333px 8.33334px -1.66667px #222;
  z-index: 2;
`;

const Card = styled.div`
  position: absolute;
  display: ${(props) => (props.open ? "initial" : "none")};
  top: 20px;
  right: 20px;
  width: 375px;
  border-radius: 12px;
  z-index: 1;
  background: #fdfdfd;
  background-image: url(${BackgroundIncepa});
  background-repeat: repeat;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
  height: 80px;
  background: #ffffff;
  border-radius: 12px 12px 0px 0px;
  font-size: 22px;
  line-height: 27px;
  color: #9b4d24;
`;

const Items = styled.div`
  padding: 10px;
  overflow: scroll;
  max-height: 600px;
`;

const Item = styled.div`
  display: flex;
  margin: 10px 0;
  align-items: center;
  padding: 12px;
  background: #ffffff;
  word-break: break-all;
  border-radius: 10px;
`;

const ItemImage = styled.img`
  width: 64px;
  height: 64px;
  box-shadow: 0px 4px 10px -5px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
`;

const ItemText = styled.div`
  margin-left: 12px;
  font-size: 16px;
  line-height: 150%;
  color: #a29797;
`;

export default Whishlist;
