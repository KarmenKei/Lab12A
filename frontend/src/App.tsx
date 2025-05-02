// src/App.tsx
import React, { useState } from 'react';
import './App.css';

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

type AuthFormData = {
  username: string;
  password: string;
};

type AuthResponse = User | string;

const App: React.FC = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register form: ", formData)
    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      console.log(response.body)

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.status}`);
      }

      const data: User = await response.json();
      setMessage(`Registration successful for user: ${data.username}`);
      setCurrentUser(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data: ", formData)
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
  
      setMessage(data.message);
      setCurrentUser(data.user);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="App">
      <h1>Authentication</h1>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {currentUser && (
        <div className="user-info">
          <h3>Current User</h3>
          <p>Username: {currentUser.username}</p>
          {/* <p>Password: {currentUser.password}</p> */}
          <p>Role: {currentUser.role}</p>
        </div>
      )}

      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>

      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;