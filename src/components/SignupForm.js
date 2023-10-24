import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signup', { username, password, name });
      if (response.data.success) {
        // Navigate to the login page upon successful signup
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
    <div className='signup-container'>
      <h2 className="signup-heading">Signup</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <div className='form-group'>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='form-group'>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='form-group'>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn-signup" type="submit">Signup</button>
      </form>
      {error && <p>{error}</p>}
    </div>
    <p className='login-link'>
    already have an account? <Link to="/login">Login</Link>
  </p>
  </>
  );
}

export default SignupForm;
