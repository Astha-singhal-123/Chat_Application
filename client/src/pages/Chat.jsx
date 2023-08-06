import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { allchats, newchats, sendmsg, host } from "../utils/APIroutes";
import Contacts from "../components/displaychats";
import ChatContents from "../components/chatContents";
import NewGroup from "../components/newGroup";
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [currUser, setcurrUser] = useState(null);
  const [allChats, setallChats] = useState([]);
  const [pagetoview, setpagetoview] = useState(0);
  const [values, setValues] = useState({
    email: "",
  });
  const [currChat, setcurrChat] = useState(undefined);
  const [msgtosend, setmsgtosend] = useState(null);
  const toastoptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
  };
  useEffect(() => {
    async function f() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setcurrUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      }
    }
    f();
  }, []);
  useEffect(() => {
    async function f1() {
      if (currUser !== null) {
        const { _id } = currUser;
        const data = await axios.get(`${allchats}/${_id}`);
        setallChats(data.data.allchats);
      }
    }
    f1();
  }, [currUser]);
  useEffect(() => {
    if (currUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currUser.username);
      socket.current.on("msg-recieve", (msg) => {
        console.log({ msg });
        let arr=[];
        allChats.map((chat, index) => {
          if (msg._id !== chat._id) {
            arr=[...arr,chat];
          }
        });
        arr=[msg,...arr];
        setallChats(arr);
        if(currChat&&currChat._id===msg._id)
        {
          setcurrChat(msg)
        }
      });
    }
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email } = values;
    const requester = currUser.username;
    const { data } = await axios.post(newchats, {
      email,
      requester,
    });
    if (data.status === false) {
      toast.error(data.msg, toastoptions);
    } else {
      setallChats([...allChats, data.newchat]);
    }
    setpagetoview(0);
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handlenewchat = () => {
    setpagetoview(1);
  };
  const handlenewgroup = () => {
    setpagetoview(2);
  };
  const inputHandle = async (msg) => {
    const { data } = await axios.post(sendmsg, {
      sender: currUser.username,
      isattachment: false,
      message: msg,
      chat_id: currChat._id,
    });
    if (data.status === true) {
      setmsgtosend(currChat._id);
    }
  };
  useEffect(() => {
    if (socket.current && msgtosend !== null) {
      socket.current.emit("send-msg", {
        chat_id: msgtosend,
      });
      setmsgtosend(null);
    }
  }, [msgtosend]);
  return (
    <>
      <Container>
        <div className="chatarea">
          <div className="contacts">
            <div className="buttons">
              <button onClick={() => handlenewchat()}>New Chat</button>
              <button onClick={() => handlenewgroup()}>New Group</button>
            </div>
            <Contacts
              contacts={allChats}
              currentUser={currUser}
              changeChat={(contact) => {
                setcurrChat(contact);
                setpagetoview(0);
              }}
            />
          </div>
          <div className="chats">
            {pagetoview === 0 ? (
              currChat === undefined || currUser === null ? (
                <h1>WELCOME!</h1>
              ) : (
                <ChatContents
                  chat={currChat}
                  currentUser={currUser}
                  inputHandle={(msg) => inputHandle(msg)}
                  socket={socket}
                />
              )
            ) : pagetoview === 1 ? (
              <div className="who">
                <form onSubmit={(event) => handleSubmit(event)}>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={(e) => handleChange(e)}
                  />
                  <button type="submit">Find User</button>
                </form>
              </div>
            ) : (
              <NewGroup />
            )}
          </div>
        </div>
      </Container>
      <ToastContainer />
    </>
  );
}
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: black;
  justify-content: center;
  align-items: center;
  .chatarea {
    display: grid;
    grid-template-columns: 25% 75%;
    width: 95vw;
    height: 95vh;
    background-color: pink;
    border-radius: 0.4rem;
    .contacts {
      display: grid;
      grid-template-rows: 10% 90%;
      overflow: hidden;
      .buttons {
        display: grid;
        grid-template-columns: 50% 50%;
        button {
          padding: 0.1rem;
          border: 0.1rem solid;
          width: 100%;
          font-size: 1rem;
          border-radius: 0.4rem;
          text-transform: uppercase;
          background-color: lightgreen;
          &:hover {
            background-color: lightblue;
            cursor: pointer;
            transition: ease-in-out 0.25s;
          }
        }
      }
    }
    .chats {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      overflow: hidden;
      .who {
        display: flex;
        width: 50vw;
        height: 50vh;
        border-radius: 1rem;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        form {
          display: flex;
          flex-direction: column;
          background-color: lightcoral;
          gap: 0.69rem;
          border-radius: 2rem;
          padding: 3rem 5rem;
          input {
            padding: 1rem;
            border: 0.1rem solid;
            border-radius: 0.8rem;
            width: 100%;
            font-size: 1rem;
            &:focus {
              border: 0.1rem solid;
              border-color: red;
              outline: none;
              transition: ease-in-out 0.1s;
            }
          }
          button {
            padding: 1rem;
            border: 0.1rem solid;
            border-radius: 0.8rem;
            width: 100%;
            font-size: 1rem;
            text-transform: uppercase;
            background-color: lightgreen;
            &:hover {
              background-color: lightblue;
              cursor: pointer;
              transition: ease-in-out 0.25s;
            }
          }
        }
      }
    }
  }
`;
export default Chat;
