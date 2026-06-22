import { useState } from 'react';
import { useAuth } from '../context/authcontext';

export default function Login({ onLoginSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Bersihkan error lama
    try {
      // Memanggil fungsi login simulasi dari authcontext
      await login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Username atau password salah.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '100px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#008CBA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Masuk
        </button>
      </form>
    </div>
  );
}