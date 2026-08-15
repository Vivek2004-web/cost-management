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
      let activeToken = token;

      // If no token exists in localStorage, auto-login so dashboard opens directly
      if (!activeToken) {
        try {
          let res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'viveksalaria3010@gmail.com', password: 'password123' })
          });
          let data = await res.json();

          if (!data.success) {
            // Fallback to demo account if default password differs
            res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: 'demo@aws-monitor.com', password: 'demo1234' })
            });
            data = await res.json();
          }

          if (data.success) {
            localStorage.setItem('cloud_monitor_token', data.token);
            setToken(data.token);
            setUser(data.user);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Auto-login error:', err);
        }
      }

      if (!activeToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${activeToken}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
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

