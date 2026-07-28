import React, { useState, useEffect } from 'react';
import { Mail, Send, Trash2, X, CheckCircle2, ShieldCheck, Bell } from 'lucide-react';

export default function EmailAlertModal({ token, onClose }) {
  const [emailList, setEmailList] = useState([]);
  const [name, setName] = useState('FinOps Administrator');
  const [email, setEmail] = useState('');
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    try {
      const res = await fetch('/api/alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEmailList(data.emails);
      }
    } catch (err) {
      console.error('Fetch emails error:', err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (!email || !name) return;

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      if (data.success) {
        setEmail('');
        fetchEmails();
      }
    } catch (err) {
      console.error('Add email error:', err);
    }
  };

  const handleDeleteEmail = async (id) => {
    try {
      await fetch(`/api/alerts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmails();
    } catch (err) {
      console.error('Delete email error:', err);
    }
  };

  const handleSendTestEmail = async (targetEmail) => {
    setLoading(true);
    setTestResult('');
    try {
      const res = await fetch('/api/alerts/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(data.message);
      }
    } catch (err) {
      setTestResult('Failed to send test email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '520px', width: '100%', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3B82F6'
          }}>
            <Mail size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Email Alert Notifications</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure email recipients for budget overruns & anomaly spikes</p>
          </div>
        </div>

        {testResult && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34D399',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{testResult}</div>
          </div>
        )}

        {/* Existing Email Recipients */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Configured Email Recipients
          </h4>
          {emailList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {emailList.map((item) => (
                <div key={item.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.email}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleSendTestEmail(item.email)}
                      disabled={loading}
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                    >
                      <Send size={12} /> Send Test Email
                    </button>
                    <button
                      onClick={() => handleDeleteEmail(item.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No email recipients added yet. Add an email below to receive instant alerts.
            </div>
          )}
        </div>

        {/* Add Email Form */}
        <form onSubmit={handleAddEmail} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Add New Recipient</h4>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Recipient Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan (DevOps)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="devops-alerts@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Close</button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Recipient</button>
          </div>
        </form>
      </div>
    </div>
  );
}
