import React from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();

  const routeToPrivate = () => {
    navigate("/private");
  }
  const routeToGroup = () => {
    navigate("/group");
  }
  return (
    <div className='login-container'>
        <h1 className='login-heading'>You can Chat with your friends !!</h1>
        <h2>One on One Conversation</h2>
        <button className="btn-login" onClick={routeToPrivate}>Private Chat</button>
        <h2>Group Conversation</h2>
        <button className="btn-login" onClick={routeToGroup}>Group Chat</button>
    </div>
  )
}

export default Home