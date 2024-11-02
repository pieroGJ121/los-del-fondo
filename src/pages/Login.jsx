import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/login.scss';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Login attempt:', formData);
  };

  return (
    <div className="login-page">
      <div className="form-content">
        <h2>Login</h2>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        <button className="login-button" onClick={handleSubmit}>Log In</button>
        <p className="forgot-password" onClick={handleForgotPassword}>Forgot your password?</p>
      </div>
    </div>
  );
}

export default Login;
