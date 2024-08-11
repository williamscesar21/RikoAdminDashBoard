import React, { useState } from 'react';
import '../css/AdminLog.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminLog = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://rikoapi.onrender.com/api/admin/admin-login', { username, password });
      Cookies.set('token', response.data.token);
      Cookies.set('username', response.data.admin.username);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://rikoapi.onrender.com/api/admin/admin', { username, password });
      alert('Now you can login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="header">
          <img src="../../logoBlanco.png" alt="Logo" className="logo" />
          <h2 className="title">Admin Dashboard</h2>
          <p className="subtitle">Sign in to your account or create a new one</p>
        </div>
        <div className="tabs-container">
          <div className="tabs-list">
            <button className={`tabs-trigger ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Sign In</button>
            <button className={`tabs-trigger ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Sign Up</button>
          </div>
          {activeTab === 'login' && (
            <div className="tabs-content">
              <form className="form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input id="username" type="username" placeholder="example123" onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="submit-button" onClick={handleLogin}>Sign in</button>
              </form>
            </div>
          )}
          {activeTab === 'signup' && (
            <div className="tabs-content">
              <form className="form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input id="username" type="username" placeholder="example123" onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="submit-button" onClick={handleSignup}>Sign up</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLog;
