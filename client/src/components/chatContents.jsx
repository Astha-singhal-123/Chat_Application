import React, { useState, useEffect, useRef } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatContents({ chat, currentUser, inputHandle }) {
  const handleChange = (e) => {
    setMsg(e.target.value);
  };
  const [msg, setMsg] = useState("");
  const messagesRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  useEffect(() => setscroll(), [chat, showEmojiPicker]);
  const handleEmojiClick = (emojiObject, event) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };
  const setscroll = () => {
    if (messagesRef !== null)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };
  const onSend = (e) => {
    e.preventDefault();
    if (msg.length > 0) {
      inputHandle(msg);
      setMsg("");
    }
  };
  return (
    <>
      {showEmojiPicker === true ? (
        <Container1>
          <div className="header">
            <h2>
              {chat.isGroup === true
                ? `${chat.Name}`
                : chat.Members.map((Member, index) => {
                    if (Member !== currentUser.username) return Member;
                  })}
            </h2>
          </div>
          <div className="messageContainor" ref={messagesRef}>
            {chat.Chats.map((message) => {
              return (
                <div
                  className={`msg${
                    message.sender === currentUser.username ? "sent" : "rcv"
                  }`}
                >
                  <p className="body">
                    <p className="head">{message.sender}</p>
                    {message.message}
                    <p className="time">
                      {message.createdAt.substring(0, 10)}
                      <br />
                      {message.createdAt.substring(11, 16)}
                    </p>
                  </p>
                </div>
              );
            })}
            {/* {setscroll()} */}
          </div>
          {showEmojiPicker === true ? (
            <Picker
              onEmojiClick={(emojiobject, event) =>
                handleEmojiClick(emojiobject, event)
              }
            />
          ) : (
            <></>
          )}
          <div className="inputContainor">
            <div className="emoji">
              <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
            </div>
            <form onSubmit={(e) => onSend(e)}>
              <input
                type="text"
                name="input"
                value={msg}
                placeholder="Type Your Message here"
                onChange={(e) => handleChange(e)}
              />
              <button type="submit">
                <IoMdSend />
              </button>
            </form>
          </div>
        </Container1>
      ) : (
        <Container>
          <div className="header">
            <h2>
              {chat.isGroup === true
                ? `${chat.Name}`
                : chat.Members.map((Member, index) => {
                    if (Member !== currentUser.username) return Member;
                  })}
            </h2>
          </div>
          <div className="messageContainor" ref={messagesRef}>
            {chat.Chats.map((message) => {
              return (
                <div
                  className={`msg${
                    message.sender === currentUser.username ? "sent" : "rcv"
                  }`}
                >
                  <p className="body">
                    <p className="head">{message.sender}</p>
                    {message.message}
                    <p className="time">
                      {message.createdAt.substring(0, 10)}
                      <br />
                      {message.createdAt.substring(11, 16)}
                    </p>
                  </p>
                </div>
              );
            })}
            {/* {setscroll()} */}
          </div>
          {showEmojiPicker === true ? (
            <Picker
              onEmojiClick={(emojiobject, event) =>
                handleEmojiClick(emojiobject, event)
              }
            />
          ) : (
            <></>
          )}
          <div className="inputContainor">
            <div className="emoji">
              <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
            </div>
            <form onSubmit={(e) => onSend(e)}>
              <input
                type="text"
                name="input"
                value={msg}
                placeholder="Type Your Message here"
                onChange={(e) => handleChange(e)}
              />
              <button type="submit">
                <IoMdSend />
              </button>
            </form>
          </div>
        </Container>
      )}
    </>
  );
}
const Container1 = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 10% 20% 60% 10%;
  overflow: hidden;
  .header {
    overflow: hidden;
    padding: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: lightcoral;
    border: 0.1rem solid;
    border-radius: 0.4rem;
  }
  .messageContainor {
    display: flex;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: lightcoral;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    gap: 0.1rem;
    .msgsent {
      display: flex;
      justify-content: flex-end;
      padding: 0.5rem;
      .body {
        .head {
          color: lightgreen;
          font-size: 0.9rem;
        }
        .time {
          color: lightgreen;
          font-size: 0.5rem;
        }
        background-color: lightcoral;
        padding: 0.5rem;
        border: 0.1rem solid;
        border-radius: 0.4rem;
        max-width: 40%;
        overflow-wrap: break-word;
        font-size: 1rem;
      }
    }
    .msgrcv {
      display: flex;
      justify-content: flex-start;
      padding: 0.5rem;
      .body {
        .head {
          color: lightgreen;
          font-size: 0.9rem;
        }
        .time {
          color: lightgreen;
          font-size: 0.5rem;
        }
        background-color: lightcoral;
        padding: 0.5rem;
        border: 0.1rem solid;
        border-radius: 0.4rem;
        max-width: 40%;
        font-size: 1rem;
        overflow-wrap: break-word;
      }
    }
  }
  .inputContainor {
    overflow: hidden;
    display: grid;
    grid-template-columns: 5% 95%;
    .emoji {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: auto;
      svg {
        font-size: 2.5rem;
        color: #fffb00;
        cursor: pointer;
      }
    }
    form {
      display: grid;
      width: 100%;
      height: 100%;
      grid-template-columns: 90% 10%;
      justify-content: center;
      align-items: center;
      input {
        height: 100%;
        width: 100%;
        padding: 0.5rem;
        border: 0.1rem solid;
        border-radius: 0.4rem;
        font-size: 1rem;
        &:focus {
          border: 0.1rem solid;
          border-color: red;
          outline: none;
          transition: ease-in-out 0.1s;
        }
      }
      button {
        padding: 0.1rem;
        border: 0.1rem solid;
        width: 100%;
        height: 100%;
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
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  overflow: hidden;
  .header {
    overflow: hidden;
    padding: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: lightcoral;
    border: 0.1rem solid;
    border-radius: 0.4rem;
  }
  .messageContainor {
    display: flex;
    flex-direction: column;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: lightcoral;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    gap: 0.1rem;
    .msgsent {
      display: flex;
      justify-content: flex-end;
      padding: 0.5rem;
      .body {
        .head {
          color: lightgreen;
          font-size: 0.9rem;
        }
        .time {
          font-size: 0.5rem;
          color: lightgreen;
        }
        background-color: lightcoral;
        padding: 0.5rem;
        border: 0.1rem solid;
        border-radius: 0.4rem;
        max-width: 40%;
        overflow-wrap: break-word;
        font-size: 1rem;
      }
    }
    .msgrcv {
      display: flex;
      justify-content: flex-start;
      padding: 0.5rem;
      .body {
        .head {
          color: lightgreen;
          font-size: 0.5rem;
        }
        .time {
          font-size: 0.5rem;
          color: lightgreen;
        }
        background-color: lightcoral;
        padding: 0.5rem;
        border: 0.1rem solid;
        border-radius: 0.4rem;
        max-width: 40%;
        font-size: 1rem;
        overflow-wrap: break-word;
      }
    }
  }
  .inputContainor {
    overflow: hidden;
    display: grid;
    grid-template-columns: 5% 95%;
    .emoji {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: auto;
      svg {
        font-size: 2.5rem;
        color: #fffb00;
        cursor: pointer;
      }
    }
    form {
      display: grid;
      width: 100%;
      height: 100%;
      grid-template-columns: 90% 10%;
      justify-content: center;
      align-items: center;
      input {
        height: 100%;
        width: 100%;
        padding: 0.5rem;
        border: 0.1rem solid;
        border-radius: 0.4rem;
        font-size: 1rem;
        &:focus {
          border: 0.1rem solid;
          border-color: red;
          outline: none;
          transition: ease-in-out 0.1s;
        }
      }
      button {
        padding: 0.1rem;
        border: 0.1rem solid;
        width: 100%;
        height: 100%;
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
`;
