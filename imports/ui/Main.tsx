import React from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";

const isRoomOrMessage = (item) => {
  if (item && item.text) {
    return "message";
  }
  return "room";
}

export const Main = () => {
  const navigate = useNavigate();
  const { data: rooms } = api.chatRooms.usePublication();
  const { data: latestMessagesInRooms } = api.latestMessagesOnRooms.usePublication();

  const createChatRoom = async () => {
    const room = await api.createChatRoom();
    navigate(`/chat/${room}`);
  };

  return (
    <div>
      <h1>Welcome to chat!</h1>
      <button onClick={createChatRoom}>
        Click me to generate and go to a chat room
      </button>
      <br />
      <span>Or select a chat from the list below to go to that chat room</span>
      <h3>Chats:</h3>
      {rooms.length === 0 && (
        <span>We do not have rooms yet, why don't you create one?</span>
      )}
      <ul>
        {rooms?.map((room) => (
          <li key={room._id}>
            <a href={`/chat/${room._id}`}>Chat room {room._id}</a>
          </li>
        ))}
      </ul>

      <h3>Latest messages in rooms:</h3>
      {latestMessagesInRooms?.length === 0 && (
        <span>No messages in rooms yet</span>
      )}
      <ul>
        {latestMessagesInRooms?.map((messageOrRoom, i) => {
          const type = isRoomOrMessage(messageOrRoom);
          if (type === "message") {
            return (
              <li key={i}>
                <strong>{messageOrRoom.who} said</strong>: {messageOrRoom.text}{" "}
                <em> in ({new Date(messageOrRoom.createdAt).toLocaleString()})</em>
                {" "} at chat room{" "} <a href={`/chat/${messageOrRoom.where}`}> {messageOrRoom.where}</a>
              </li>
            );
          }
          return (
            <li key={i}>
              <a href={`/chat/${messageOrRoom._id}`}>Chat room {messageOrRoom._id}</a>
            </li>
          );
        })}
      </ul>

    </div>
  );
};
