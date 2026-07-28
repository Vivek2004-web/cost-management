import React, { useState } from 'react';
import { CheckSquare, Clock, ShieldAlert, Zap, Power, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AutomationCenter() {
  const [rules, setRules] = useState([
    { id: 'rule-1', name: 'Scheduled Weekend EC2 Shutdown', category: 'Auto Stop', schedule: 'Fri 8:00 PM - Mon 6:00 AM', status: 'ACTIVE', savingsEst: '$420/mo' },
    { id: 'rule-2', name: 'Orphaned EBS Disk Purge (>30 Days)', category: 'Storage Cleanup', schedule: 'Daily at Midnight', status: 'ACTIVE', savingsEst: '$185/mo' },
    { id: 'rule-3', name: '1-Year Compute Savings Plan Expiry Alert', category: 'Commitment', schedule: '30 Days Prior', status: 'ACTIVE', savingsEst: '$560/mo' }
  ]);

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : r));
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={22} color="#F59E0B" />
            FinOps Automation & Scheduled Governance
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Automated rules for scheduled shutdowns, volume cleanups, and Savings Plan renewal alerts
          </p>
        </div>

        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Zap size={16} /> Create Automation Rule
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {rules.map((rule) => {
          const isActive = rule.status === 'ACTIVE';

          return (
            <div key={rule.id} className="glass-card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245,158,11,0.3)' }}>
                    {rule.category}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#34D399' }}>
                    Est. {rule.savingsEst}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
                  {rule.name}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#9CA3AF" /> Schedule: {rule.schedule}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isActive ? '#34D399' : 'var(--text-muted)' }}>
                  STATUS: {rule.status}
                </span>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  <Power size={14} color={isActive ? '#34D399' : '#F87171'} />
                  {isActive ? 'Pause Rule' : 'Activate Rule'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
