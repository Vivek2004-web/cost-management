import React, { useState, useEffect } from 'react';
import { Cloud, Loader2 } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { ToastProvider } from './components/Toast';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cloud_monitor_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem('cloud_monitor_token');
          setToken('');
        }
      } catch (err) {
        console.error('Auth verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const handleLoginSuccess = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('cloud_monitor_token');
    setUser(null);
    setToken('');
  };

  return (
    <ToastProvider>
      {loading ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.25)'
            }}>
              <Cloud size={32} color="#3B82F6" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
              <Loader2 size={16} className="spin-anim" color="#3B82F6" />
              Initializing Cloud Financial Engine...
            </div>
          </div>
        </div>
      ) : !token || !user ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard
          user={user}
          token={token}
          onLogout={handleLogout}
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </ToastProvider>
  );
}

