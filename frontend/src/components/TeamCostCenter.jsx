import React from 'react';
import { Users, PieChart, TrendingUp } from 'lucide-react';

export default function TeamCostCenter() {
  const teams = [
    { name: 'Engineering', spend: 1420.00, percentage: 45.5, color: '#3B82F6', members: 14 },
    { name: 'DevOps & Infra', spend: 890.00, percentage: 28.5, color: '#FF9900', members: 6 },
    { name: 'QA & Staging', spend: 510.00, percentage: 16.3, color: '#8B5CF6', members: 8 },
    { name: 'Marketing & Analytics', spend: 300.00, percentage: 9.6, color: '#10B981', members: 4 }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={22} color="#8B5CF6" />
            Team & Department Cost Center Allocation
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Internal cloud cost attribution across Engineering, DevOps, QA, and Marketing teams
          </p>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          4 Teams Active
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {teams.map((t) => (
          <div key={t.name} className="glass-card-interactive" style={{ padding: '18px', borderLeft: `4px solid ${t.color}` }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
              {t.name}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: t.color, marginBottom: '6px' }}>
              ${t.spend.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{t.members} Team Members</span>
              <strong style={{ color: t.color }}>{t.percentage}%</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
