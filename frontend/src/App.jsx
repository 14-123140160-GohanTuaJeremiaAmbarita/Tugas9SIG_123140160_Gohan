import { useState } from 'react';
import MapView from './components/MapView';
import Login from './components/login';
import Register from './components/register';
import { useAuth } from './context/authcontext';
import './App.css';

function App() {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState('map'); // 'map', 'login', atau 'register'

  return (
    <div className="app-container">
      <header className="main-header" style={{ background: '#282c34', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>WebGIS Fasilitas Publik Bandar Lampung</h1>
        <div className="auth-controls" style={{ display: 'flex', gap: '10px' }}>
          {user ? (
            <>
              <span className="status-badge" style={{ color: '#4CAF50', alignSelf: 'center', fontWeight: 'bold' }}>Mode Admin Aktif</span>
              <button className="btn-logout" onClick={() => { logout(); setViewMode('map'); }} style={{ padding: '8px 12px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Keluar</button>
            </>
          ) : (
            <>
              <button onClick={() => setViewMode(viewMode === 'login' ? 'map' : 'login')} style={{ padding: '8px 12px', background: '#008CBA', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                {viewMode === 'login' ? 'Lihat Peta' : 'Login Admin'}
              </button>
              <button onClick={() => setViewMode(viewMode === 'register' ? 'map' : 'register')} style={{ padding: '8px 12px', background: '#ebd415', color: '#333', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                {viewMode === 'register' ? 'Lihat Peta' : 'Register'}
              </button>
            </>
          )}
        </div>
      </header>
      
      <main className="main-content">
        {viewMode === 'login' && !user && <Login onLoginSuccess={() => setViewMode('map')} />}
        {viewMode === 'register' && !user && <Register onRegisterSuccess={() => setViewMode('login')} />}
        {viewMode === 'map' && <MapView />}
      </main>
    </div>
  );
}

export default App;