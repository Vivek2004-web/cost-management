import React, { useState } from 'react';
import { FileText, Search, UserCheck, Sliders, Target, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ActivityTimeline() {
  const [searchTerm, setSearchTerm] = useState('');

  const events = [
    { id: 1, action: 'USER_LOGIN', details: 'Administrator logged in from IP 127.0.0.1', timestamp: 'Today at 07:45 PM', icon: UserCheck, color: '#3B82F6' },
    { id: 2, action: 'UPDATE_SETTINGS', details: 'Updated AWS credentials and region settings (us-east-1)', timestamp: 'Today at 06:30 PM', icon: Sliders, color: '#FF9900' },
    { id: 3, action: 'BUDGET_CREATED', details: 'Created Overall Cloud Spending budget ($2,500 monthly limit)', timestamp: 'Yesterday at 04:15 PM', icon: Target, color: '#8B5CF6' },
    { id: 4, action: 'ANOMALY_DETECTED', details: 'Cost anomaly alert triggered: EC2 cost spiked by +27%', timestamp: 'Yesterday at 09:20 AM', icon: ShieldAlert, color: '#F87171' },
    { id: 5, action: 'AUTOMATION_EXEC', details: 'Scheduled weekend shutdown rule paused 3 non-prod EC2 instances', timestamp: '3 days ago', icon: CheckCircle2, color: '#34D399' }
  ];

  const filteredEvents = events.filter(e => e.action.toLowerCase().includes(searchTerm.toLowerCase()) || e.details.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="#38BDF8" />
            System Audit Log & Activity Timeline
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Immutable chronological audit log of all user authentication, budget edits, and backend API events
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search activity log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '8px 12px 8px 34px',
              color: '#FFF',
              fontSize: '0.85rem',
              outline: 'none',
              width: '220px'
            }}
          />
        </div>
      </div>

      {/* Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--border-color)' }}>
        {filteredEvents.map((evt) => {
          const IconComp = evt.icon;

          return (
            <div key={evt.id} style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-31px',
                top: '2px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: `${evt.color}25`,
                border: `2px solid ${evt.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: evt.color
              }}>
                <IconComp size={12} />
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.875rem', color: evt.color }}>{evt.action}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{evt.timestamp}</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: '#D1D5DB' }}>{evt.details}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
