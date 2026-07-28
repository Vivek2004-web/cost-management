import React from 'react';
import { Users, Tag, PieChart, ChevronRight } from 'lucide-react';

export default function TeamCostTracking({ teams, currencySymbol }) {
  if (!teams || teams.length === 0) return null;
  const symbol = currencySymbol || '₹';

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#8B5CF6" />
            Team & Department Cost Tracking
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Tag-based allocation showing multi-cloud spending by internal department
          </p>
        </div>

        <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC', border: '1px solid rgba(139,92,246,0.3)' }}>
          <Tag size={12} /> TAG ALIGNED: env, team, cost-center
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Department / Team</th>
              <th style={{ padding: '12px 16px' }}>Team Size</th>
              <th style={{ padding: '12px 16px' }}>AWS Spend</th>
              <th style={{ padding: '12px 16px' }}>Azure Spend</th>
              <th style={{ padding: '12px 16px' }}>GCP Spend</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Multi-Cloud Spend</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Portfolio Share</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.team} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s ease' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#FFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.team === 'Engineering' ? '#FF9900' : (t.team === 'DevOps & Infra' ? '#3B82F6' : '#10B981') }} />
                    {t.team}
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{t.memberCount} members</td>
                <td style={{ padding: '14px 16px', color: '#FF9900', fontWeight: 600 }}>{symbol}{t.aws.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', color: '#38BDF8', fontWeight: 600 }}>{symbol}{t.azure.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', color: '#60A5FA', fontWeight: 600 }}>{symbol}{t.gcp.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#FFF' }}>
                  {symbol}{t.total.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${t.percentage}%`, height: '100%', background: '#8B5CF6', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{t.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
