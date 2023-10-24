import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room, chatHistory, sendMessage }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState(chatHistory);

  let count = 0;

  const handleSendMessage = () => {
    if (currentMessage !== "") {
      sendMessage(currentMessage); // Call the sendMessage function from props
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };
  
    socket.on("receive_message", handleReceiveMessage);
  
    return () => {
      // Cleanup the event listener to avoid memory leaks
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);
  

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
                key={count++}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyUp={(event) => {
            event.key === "Enter" && handleSendMessage();
          }}
        />
        <button onClick={handleSendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
