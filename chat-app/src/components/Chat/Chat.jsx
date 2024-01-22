import React, { useEffect, useState } from "react";
import { user } from "./../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
let socket;
const ENDPOINT = "http://localhost:3000/";

const Chat = () => {
  const [id, setId] = useState("");
  const [message, setMessage] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const send = () => {
    const message = document.getElementById("charInput").value;
    socket.emit("message", { message, id });
    setInputValue('');   

  };
  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });
    socket.on("connect", () => {
      setId(socket.id);
    });

    socket.emit("joined", { user });

    socket.on("welcome", (data) => {
      setMessage([...message, data]);
      console.log(data.user, data.message);
    });
    socket.on("userJoined", (data) => {
      setMessage([...message, data]);
      console.log(data.user, data.message);
    });
    socket.on("leave", (data) => {
      setMessage([...message, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessage([...message, data]);
      console.log(data.user, data.message, data.id);
    });
    return () => {
      socket.off();
    };
  }, [message]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header"></div>
        <ReactScrollToBottom className="chatBox">
          {message.map((item, i) => (
            <Message
              user={item.id === id ? "" : item.user}
              message={item.message}
              classs={item.id === id ? "right" : "left"}
            />
          ))}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          type="text" id="charInput" />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
