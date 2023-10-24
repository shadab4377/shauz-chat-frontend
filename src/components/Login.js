import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import '../App.css';
import { useUserContext } from '../UserContext';

function Login() {
  const {username, isAuthenticated, setIsUserAuthenticated } = useUserContext();

  function logout(){
    setIsUserAuthenticated(false);
  }
  return (
    isAuthenticated ?
    (<div className='logout-container'><h1>{username}</h1><h1>You are already Logged in </h1><button className='btn-logout' onClick={logout}>Logout</button></div>)
    :
    (<div>
      <LoginForm />
      <p className='signup-link'>
        Don't have an account? <Link to="/login/signup">Sign up</Link>
      </p>
    </div>)
  );
}

export default Login;
