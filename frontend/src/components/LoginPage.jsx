import React, { useState } from 'react';
import { Cloud, Lock, Mail, User, ArrowRight, ShieldCheck, PieChart, Zap, CheckCircle2 } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { email, password, fullName } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Save token and invoke login callback
      localStorage.setItem('cloud_monitor_token', data.token);
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickLogin = async () => {
    setEmail('demo@aws-monitor.com');
    setPassword('demo1234');
    
    // Auto register/login demo user
    setLoading(true);
    setError('');
    try {
      let res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@aws-monitor.com', password: 'demo1234' })
      });
      let data = await res.json();

      if (!data.success) {
        // Register demo user if not created yet
        res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'demo@aws-monitor.com', password: 'demo1234', fullName: 'Demo Architect' })
        });
        data = await res.json();
      }

      if (data.success) {
        localStorage.setItem('cloud_monitor_token', data.token);
        onLoginSuccess(data.user, data.token);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '1000px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
        padding: '0'
      }}>
        {/* Left Side: Product Feature Highlights */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 135, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
          borderRight: '1px solid var(--border-color)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #00FF87 0%, #10B981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(0, 255, 135, 0.45)'
              }}>
                <Cloud size={26} color="#05070A" strokeWidth={2.5} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Cloucal FinOps</h2>
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '16px' }}>
              Real-time AWS Cloud Cost Intelligence Platform
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
              Track daily AWS expenses, set proactive budget alerts, inspect service anomalies, and discover instant cost optimization recommendations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={20} color="#00FF87" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>AWS Cost Explorer API</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automated cost breakdown across EC2, RDS, S3 & Lambda</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={20} color="#3B82F6" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Budget Alerts & Thresholds</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configurable alerts before cost overruns occur</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>AI Cost Recommendations</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Detect idle EC2, unattached EBS & tiering opportunities</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: '32px'
          }}>
            🔐 Secure Backend Record Storage powered by SQLite & Express JWT Authentication
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div style={{ padding: '48px 40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '28px' }}>
            {isRegister ? 'Sign up to start monitoring your AWS cloud expenditure' : 'Sign in to access your cloud cost analytics dashboard'}
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {isRegister && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '12px 12px 12px 40px',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '12px 12px 12px 40px',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '12px 12px 12px 40px',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', padding: '12px' }}>
              {loading ? 'Authenticating...' : (isRegister ? 'Create Free Account' : 'Sign In to Dashboard')}
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ margin: '20px 0', textAlign: 'center', position: 'relative' }}>
            <div style={{ height: '1px', background: 'var(--border-color)', position: 'absolute', width: '100%', top: '50%' }}></div>
            <span style={{ position: 'relative', background: '#101624', padding: '0 12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              OR QUICK EXPLORE
            </span>
          </div>

          <button
            type="button"
            onClick={handleDemoQuickLogin}
            className="btn-secondary"
            disabled={loading}
            style={{ width: '100%', padding: '10px' }}
          >
            <Zap size={16} color="#FF9900" />
            1-Click Demo Login
          </button>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#FF9900', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
