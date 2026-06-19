import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Login Gagal.');
    }
  };

  return (
    <div className="login-container" style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none' }}>Login</button>
      </form>
    </div>
  );
}