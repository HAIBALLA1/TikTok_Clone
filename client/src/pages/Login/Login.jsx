import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');Sign up
    
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError('Email or password incorrect');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h2>Connect</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Connect
            </button>
          </form>

          <div className="auth-separator">
            <span>OR</span>
          </div>

          <div className="social-auth">
            <button className="social-button google">
              <i className="fab fa-google"></i>
              Continue with Google
            </button>
            <button className="social-button facebook">
              <i className="fab fa-facebook"></i>
              Continue with Facebook
            </button>
          </div>
        </div>

        <div className="auth-switch">
          <p>Don't have an account?</p>
          <Link to="/register" className="switch-button">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;