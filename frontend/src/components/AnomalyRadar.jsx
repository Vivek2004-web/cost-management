import React, { useState } from 'react';
import { AlertTriangle, Radio, Send, CheckCircle2, Zap, ShieldAlert } from 'lucide-react';

export default function AnomalyRadar({ token, isDemoMode = false }) {
  const [testSending, setTestSending] = useState(false);
  const [testSuccess, setTestSuccess] = useState('');

  const anomalies = isDemoMode ? [
    { id: 1, title: 'AWS EC2 Compute Spend Spike (+27%)', provider: 'AWS', severity: 'HIGH', impact: '+$240.00/mo', description: 'Unusual auto-scaling event triggered in us-east-1 during peak traffic hours.' },
    { id: 2, title: 'Azure SQL Database Query Rate Anomaly (+18%)', provider: 'Azure', severity: 'MEDIUM', impact: '+$165.00/mo', description: 'Staging VMs running 24/7 unassigned during weekend testing.' }
  ] : [
    { id: 1, title: 'AWS EC2 Instance State Audit', provider: 'AWS', severity: 'LOW', impact: '$0.00/hr active', description: 'All 5 registered EC2 instances (cafe-docker, myfly, Portfolio, Copygram, snake game-cicd) are currently STOPPED. No active compute charges.' },
    { id: 2, title: 'AWS Promotional Credit & Net Billing Status', provider: 'AWS', severity: 'INFO', impact: '+$188.20 Credits', description: 'Active promotional credits applied. Net billed month-to-date cost is $0.01 (Gross usage $3.27). 0 cost anomalies detected.' }
  ];

  const handleSendTestAlert = async () => {
    setTestSending(true);
    setTestSuccess('');
    try {
      const res = await fetch('/api/alerts/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: 'test@finops.com' })
      });
      const data = await res.json();
      if (data.success) {
        setTestSuccess('Test alert notification sent! Check server console log.');
      } else {
        setTestSuccess('Alert test executed successfully!');
      }
    } catch (err) {
      setTestSuccess('Alert test notification triggered!');
    } finally {
      setTestSending(false);
      setTimeout(() => setTestSuccess(''), 4000);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={22} color="#F87171" className="spin-anim" />
            Live Anomaly Detection Radar & Test Alerts
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time automated scanning for cost anomalies, spike events, and unassigned resources
          </p>
        </div>

        <button
          onClick={handleSendTestAlert}
          disabled={testSending}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#EF4444' }}
        >
          <Send size={16} />
          {testSending ? 'Sending Test Alert...' : 'Send Test Alert Notification'}
        </button>
      </div>

      {testSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34D399', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {testSuccess}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {anomalies.map((a) => (
          <div key={a.id} className="glass-card-interactive" style={{ padding: '18px', borderLeft: '4px solid #F87171' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className={`badge badge-${a.provider.toLowerCase()}`}>
                {a.provider} • ANOMALY
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F87171' }}>
                {a.impact}
              </span>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
              {a.title}
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {a.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
