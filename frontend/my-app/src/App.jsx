import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './App.css'

const API_URL = 'https://todo-new-8z7t.onrender.com';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [authMode, setAuthMode] = useState('login'); // or signup
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');

useEffect(() => {
  if (token) {
    try {
      const decoded = jwtDecode(token);
      setUser({ username: decoded.username, role: decoded.role });
      fetchTodos(token);
    } catch (err) {
      console.error("Failed to decode token", err);
      handleLogout(); // Optionally logout on bad token
    }
  }
}, [token]);


  const fetchTodos = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username: form.username, password: form.password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignup = async () => {
    setError('');
    try {
      await axios.post(`${API_URL}/auth/signup`, form);
      setAuthMode('login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setTodos([]);
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/todos`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos([...todos, res.data]);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.put(`${API_URL}/todos/${id}`, { completed: !completed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
        <h2>{authMode === 'login' ? 'Login' : 'Signup'}</h2>
        <input placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} /><br /><br />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /><br /><br />
        {authMode === 'signup' && (
          <>
            <label>
              Role:
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label><br /><br />
          </>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={authMode === 'login' ? handleLogin : handleSignup}>
          {authMode === 'login' ? 'Login' : 'Signup'}
        </button><br /><br />
        <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
          Switch to {authMode === 'login' ? 'Signup' : 'Login'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
 <h2>Welcome, {user?.username} ({user?.role})</h2>

      <button onClick={handleLogout}>Logout</button>
      <hr />
      <h3>Your Todos</h3>
      <input
        placeholder="Add new todo"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ margin: '10px 0', color:'rgb(241, 16, 16)' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', marginLeft: 10 }}>
              {todo.text}
            </span>
            <button style={{ marginLeft: 10 }} onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
