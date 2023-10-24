import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useUserContext } from '../UserContext';
import Chat2 from './Chat2';
import { v4 } from 'uuid';
const socket = io.connect('http://localhost:5000', {
  cors: {
    origin: '*',
    credentials: false
  }, transports: ['websocket']
})
function PrivateChat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [room,setRoom] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [chatRequest, setChatRequest] = useState(null); // To store the chat request details
  const { username } = useUserContext();
  const [requestSentName, setRequestSentName] = useState('');
  const [openChat,setOpenChat] = useState(false);
  const [myUser, setMyUser] = useState(null);
  // Replace with the actual username after authentication

  useEffect(() => {
    // Emit an authenticate event to associate the user's socket with their username
    socket.emit("authenticate", { username });
  }, [username]);

  useEffect(() => {
    // Listen for chatRequest event from the server
    socket.on("chatRequest", (data) => {
      setChatRequest({ ...data, accepted: null }); // Store the chat request details
      setRoom(data.room);
    });

    socket.on("chatRequestAccepted", (room) => {
      setChatRequest((prevRequest) => ({ ...prevRequest, accepted: true }))
    });

    socket.on("chatRequestDeclined", () => {
      setChatRequest((prevRequest) => ({ ...prevRequest, accepted: false }))
      setOpenChat(false);
    });
  });

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/search-users?query=${searchQuery}`);
      const data = await response.json();
      const filteredResults = data.results.filter(user => user.username !== username);
      const userDetails = data.results.filter(user => user.username === username);
      setMyUser(userDetails[0]);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChatRequest = (user) => {
    // Emit a Socket.io event to notify the recipient of the chat request
    const room = v4();
    setRoom(room);
    const recipientUsername = user.username;
    setRequestSentName(user.name);
    socket.emit("join_chat",room);
    setSearchResults([]);
    setOpenChat(true);
    socket.emit("chatRequest", { senderUser: myUser, recipientUsername, room });
  };

  const acceptChatRequest = async () => {
    // Emit an event to notify the sender that the chat request has been accepted
    await socket.emit("acceptChatRequest", { senderUsername: chatRequest.senderUser.username, room });
    socket.emit("join_chat",room);
    setRequestSentName(chatRequest.senderUser.name);
    setOpenChat(true);
    setChatRequest(null); // Clear the chat request details
  };

  const declineChatRequest = () => {
    // Emit an event to notify the sender that the chat request has been declined
    socket.emit("chatRequestDeclined", { senderUsername: chatRequest.senderUser.username });
    setChatRequest(null); // Clear the chat request details
  };

  

  return (
    <div>
      <input
        type="text"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {searchResults.map((user) => (
          <li key={user.username}>
            {user.name} - ( {user.username} ){" "}
            <button onClick={() => {handleChatRequest(user)}}>
              Start Chat
            </button>
          </li>
        ))}
      </ul>

      {chatRequest && (
        <div>
          {chatRequest.accepted == null ? (
            <div>
              <p>{chatRequest.senderUser.name} wants to start a chat with you.</p>
              <button onClick={acceptChatRequest}>Accept</button>
              <button onClick={declineChatRequest}>Decline</button>
            </div>
          ) : (<>
            <p>
              {requestSentName}
              {chatRequest.accepted
                ? " accepted your Chat request "
                : " declined your Chat request "}
            </p>
            </>
          )}
        </div>
      )}
      { openChat && (
      <>
        <Chat2 socket={socket} username={username} room={room} other={requestSentName}/>
      </>) }
    </div>
  );

}

export default PrivateChat;
