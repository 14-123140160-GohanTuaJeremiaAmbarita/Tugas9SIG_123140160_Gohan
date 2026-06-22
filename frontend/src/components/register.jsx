import { useState } from 'react';

export default function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi input form pendaftaran sesuai instruksi soal
    if (username.trim().length < 4) {
      setError('Validasi Gagal: Username minimal harus 4 karakter!');
      return;
    }
    if (password.length < 4) {
      setError('Validasi Gagal: Password minimal harus 4 karakter!');
      return;
    }
    if (password !== confirmPassword) {
      setError('Validasi Gagal: Konfirmasi password tidak cocok!');
      return;
    }

    // Simulasi penyimpanan pendaftaran user baru berhasil
    setSuccess('Registrasi Berhasil! Silakan kembali ke menu login.');
    setTimeout(() => {
      onRegisterSuccess();
    }, 2000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '60px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#333', textAlign: 'center', marginBottom: '20px' }}>Register Admin Baru</h2>
      {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Username Baru:</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Konfirmasi Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
          Daftar Sekarang
        </button>
      </form>
    </div>
  );
}