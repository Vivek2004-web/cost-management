import React from 'react';
import { AlertTriangle, TrendingUp, HelpCircle, Activity } from 'lucide-react';

export default function AnomalyAlerts({ anomalies, currencySymbol }) {
  if (!anomalies || anomalies.length === 0) return null;
  const symbol = currencySymbol || '₹';

  return (
    <div className="glass-panel" style={{
      padding: '20px 24px',
      marginBottom: '28px',
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.08) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} className="pulse-effect" />
          Real-Time Cost Anomaly Detection
        </h3>
        <span className="badge badge-warning">
          <Activity size={12} /> {anomalies.length} ACTIVE ANOMALIES DETECTED
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {anomalies.map((anom) => (
          <div key={anom.id} style={{
            background: 'rgba(10, 13, 20, 0.7)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FF9900', background: 'rgba(255,153,0,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                {anom.provider} • {anom.service}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{anom.timestamp}</span>
            </div>

            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
              ⚠️ Spending spiked by <span style={{ color: '#F87171', fontWeight: 800 }}>+{anom.spikePercentage}%</span> compared to yesterday
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Daily Spend jumped from {symbol}{anom.previousSpend} ➔ <strong style={{ color: '#F87171' }}>{symbol}{anom.currentSpend}</strong>
            </div>

            <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <HelpCircle size={14} /> Diagnostic Root Cause Analysis:
              </div>
              <ul style={{ paddingLeft: '18px', fontSize: '0.775rem', color: '#D1D5DB', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {anom.possibleReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
