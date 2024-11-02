import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/forgotpassword.scss';
function ForgotPassword() {
  const  navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    navigate('/');
  };

  return (
    <div className="forgot-password-page">
      <div className="form-content">
        <h1>Reset Your Password</h1>
        <input type="email" placeholder='email@example.com' value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="reset-button" onClick={handleSubmit}>Reset Password</button>
      </div>
    </div>
  );
}

export default ForgotPassword;