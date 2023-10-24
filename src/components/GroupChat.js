import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import io from 'socket.io-client';
import '../App.css';
import { Outlet } from 'react-router-dom';

const socket = io.connect('http://localhost:5000', {
  cors: {
    origin: '*',
    credentials: false
  }, transports: ['websocket']
})
function GroupChat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatRooms, setChatRooms] = useState([]); // Store chat room list
  const [chatHistory, setChatHistory] = useState([]); // Store chat history

  useEffect(() => {
    const handleMessage = (data) => {
       // Update chat history when a new message is received
      setChatHistory((prevHistory) => [...prevHistory, data]);
    };
  
    socket.on("receive_message", handleMessage);
  
    return () => {
      // Cleanup the event listener to avoid memory leaks
      socket.off("receive_message", handleMessage);
    };
  }, []);
  

  useEffect(() => {

    socket.on("chat_history", (history) => {
      // Load chat history when joining a room
      setChatHistory(history);
    });
    
    // Retrieve the chat room list from the server
    socket.emit("get_chat_rooms");
    
    socket.on("chat_rooms", (rooms) => {
      setChatRooms(rooms);
    });
  }, []);

  const joinRoom = (selectedRoom) => {
    setRoom(selectedRoom);
    setShowChat(true);
    // Join the selected room
    socket.emit("join_room", { room: selectedRoom });
  };

  const sendMessage = (message) => {
    const messageData = {
      room: room,
      author: username,
      message: message,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };

    socket.emit("send_message", messageData);
  };
  
  return (
    <div className="App">
      <div className="room-list">
        <h3>Chat Rooms</h3>
        <ul>
          {chatRooms.map((roomName) => (
            <li key={roomName}>
              <button onClick={() => joinRoom(roomName)}>{roomName}</button>
            </li>
          ))}
        </ul>
      </div>
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Shadab..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} chatHistory={chatHistory} sendMessage={sendMessage} />
      )}
      <Outlet />
    </div>
  );
}

export default GroupChat;