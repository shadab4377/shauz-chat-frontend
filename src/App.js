import React from 'react';
import './App.css'
import GroupChat from './components/GroupChat';
import PrivateChat from './components/PrivateChat';
import Settings from './components/Settings';
import { BrowserRouter as Router, Navigate, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import { useUserContext } from './UserContext';

function App() {
  const { isAuthenticated } = useUserContext();

  return (

    <Router>
      <div>
        <nav>
          <ul className='navigation'>
            <li>
              <Link className='link-decoration' to="/">
                <img height={40} style={{ borderRadius: '50%', marginRight: '10px', verticalAlign: 'middle' }} src='/shauz.png' alt='Shauz' />
                <span>Shauz Chat</span>
              </Link>
            </li>
            <li>
              <Link className='link-decoration' to="/group">
                <img height={40} style={{ borderRadius: '50%', marginRight: '10px', verticalAlign: 'middle' }} src='/createGroup.png' alt='group' />
                <span>Create Group</span>
              </Link>
            </li>
            <li>
              <Link className='link-decoration' to="/private">
                <img height={40} style={{ borderRadius: '10%', marginRight: '10px', verticalAlign: 'middle' }} src='/privateChat.png' alt='private' />
                <span>Private Chat</span>
              </Link>
            </li>
            <li>
              <Link className='link-decoration' to="/login">
                <img height={40} style={{ borderRadius: '50%', marginRight: '10px', verticalAlign: 'middle' }} src='/login.png' alt='login' />
                <span>Login</span>
              </Link>
            </li>
            <li>
              <Link className='link-decoration' to="/settings">
                <img height={40} style={{ borderRadius: '50%', marginRight: '10px', verticalAlign: 'middle' }} src='/settings.png' alt='settings' />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/group" element={<GroupChat />} />
          <Route path="/private" element={isAuthenticated ? <PrivateChat /> : <Navigate to="/login" />} />
          <Route path="/login">
            <Route index={true} element={<Login />} />
            <Route path="authenticate" element={<LoginForm />} />
            <Route path="signup" element={<SignupForm />} />
          </Route>
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
