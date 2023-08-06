import React, { useState } from "react";
import styled from "styled-components";
export default function Displaychats({ contacts, currentUser, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  if (currentUser == null) return;
  return (
    <>
      <Container>
        <div className="allchats">
          {contacts.map((contact, index) => {
            return (
              <div
                className={`chat${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <h3>
                  {contact !== undefined ? (
                    contact.isGroup === true ? (
                      `${contact.Name}`
                    ) : (
                      contact.Members.map((Member, index) => {
                        if (Member !== currentUser.username) return Member;
                      })
                    )
                  ) : (
                    <></>
                  )}
                </h3>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <h1>{`${currentUser.username}`}</h1>
        </div>
      </Container>
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 90% 10%;
  overflow: scroll;
  border: 0.1rem solid;
  border-radius: 0.4rem;
  background-color: lightcoral;
  .allchats {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .chat {
      display: flex;
      flex-wrap: wrap;
      padding: 1rem;
      height: 3rem;
      justify-content: center;
      align-content: center;
      &:hover {
        cursor: pointer;
        opacity: 0.5;
      }
    }
    .chatselected {
      display: flex;
      flex-wrap: wrap;
      padding: 1rem;
      height: 3rem;
      justify-content: center;
      align-content: center;
      background-color: pink;
    }
  }
  .current-user {
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
      color: lightgreen;
    }
  }
`;
