import React, { useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { username, setUsername } = useUserContext();
  const { setIsUserAuthenticated } = useUserContext();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      if (response.data.success) {
        setUsername(username);
        setIsUserAuthenticated(true);
        
        // Navigate to the private chat upon successful login
        navigate('/private');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className='login-container'>
      <h2 className='login-heading'>Login</h2>
      <form className='login-form' onSubmit={handleLogin}>
        <div className='form-group'>
          <input type="text" placeholder="Username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='form-group'>
          <input type="password" placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn-login" type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginForm;
