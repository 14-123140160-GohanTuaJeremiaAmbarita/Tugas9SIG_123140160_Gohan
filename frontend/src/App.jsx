import { useState } from 'react';
import MapView from './components/MapView';
import api from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Form standar OAuth2 Password Request Form (URL Encoded)
    const formData = new URLSearchParams();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);

    try {
      const response = await api.post('/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      // Simpan token akses ke dalam localStorage
      localStorage.setItem('token', response.data.access_token);
      setIsAuthenticated(true);
      alert("Login Berhasil! Akses CRUD Spasial Dibuka.");
      window.location.reload(); // Muat ulang komponen peta agar mendeteksi status login baru
    } catch (err) {
      alert("Login Gagal: " + (err.response?.data?.detail || "Kredensial tidak valid"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari storage
    setIsAuthenticated(false);
    alert("Keluar log berhasil.");
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
      {/* HEADER UTAMA */}
      <header style={{ background: '#1b5e20', color: 'white', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 1000 }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'sans-serif' }}>Sistem Informasi Geografis Tugas 9</h2>
        
        {/* Tombol Aksi Status Log */}
        {isAuthenticated && (
          <button onClick={handleLogout} style={{ background: '#d32f2f', color: 'white', border: '0', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
            Keluar Log (Logout)
          </button>
        )}
      </header>

      {/* KONTEN UTAMA */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', height: 'calc(100vh - 70px)', width: '100%' }}>
        
        {/* JIKA BELUM LOGIN: Tampilkan Panel Login Samping */}
        {!isAuthenticated && (
          <div style={{ width: '320px', background: '#f5f5f5', padding: '30px 20px', boxSizing: 'border-box', borderRight: '1px solid #e0e0e0', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#1b5e20' }}>Gerbang Autentikasi</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#666' }}>Mode Penjelajah (Hanya Lihat). Silakan masuk untuk mengaktifkan fitur Manipulasi CRUD Spasial.</p>
            
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Email / Username:</label>
                <input type="email" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} value={loginData.username} onChange={(e) => setLoginData({...loginData, username: e.target.value})} placeholder="admin@example.com" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Kata Sandi:</label>
                <input type="password" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', background: '#1b5e20', color: 'white', border: 0, padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {loading ? "Memverifikasi..." : "Masuk Log (Login)"}
              </button>
            </form>
          </div>
        )}

        {/* AREA PETA JALUR UTAMA */}
        <main style={{ flex: 1, position: 'relative', height: '100%', width: '100%' }}>
          <MapView />
        </main>
      </div>
    </div>
  );
}

export default App;
