import { useState } from 'react';
import MapView from './components/MapView';
import Login from './components/login';
import { useAuth } from './context/authcontext';
import './App.css';

function App() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="app-container">
      <header className="main-header" style={{ background: '#282c34', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>WebGIS Fasilitas Publik Bandar Lampung</h1>
        <div className="auth-controls">
          {user ? (
            <>
              <span className="status-badge" style={{ marginRight: '15px', color: '#4CAF50' }}>Mode Admin Aktif</span>
              <button className="btn-logout" onClick={logout} style={{ padding: '8px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>Keluar</button>
            </>
          ) : (
            <button className="btn-login-toggle" onClick={() => setShowLogin(!showLogin)} style={{ padding: '8px', background: '#008CBA', color: 'white', border: 'none', cursor: 'pointer' }}>
              {showLogin ? 'Kembali ke Peta' : 'Login Administrator'}
            </button>
          )}
        </div>
      </header>
      <main className="main-content">
        {showLogin && !user ? (
          <Login onLoginSuccess={() => setShowLogin(false)} />
        ) : (
          <MapView />
        )}
      </main>
    </div>
  );
}

export default App;