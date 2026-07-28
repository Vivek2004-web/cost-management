import React from 'react';
import { Layers } from 'lucide-react';

export default function MultiCloudBreakdown({ cloudProviders }) {
  if (!cloudProviders || cloudProviders.length === 0) return null;

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#3B82F6" />
            Multi-Cloud Provider Breakdown (AWS, Azure & GCP)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time cost allocation across Amazon Web Services, Microsoft Azure, and Google Cloud
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,153,0,0.15)', color: '#FF9900', fontWeight: 700 }}>AWS</span>
          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0,137,214,0.15)', color: '#38BDF8', fontWeight: 700 }}>AZURE</span>
          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(66,133,244,0.15)', color: '#60A5FA', fontWeight: 700 }}>GCP</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {cloudProviders.map((p) => (
          <div key={p.short} className="glass-card-interactive" style={{ padding: '20px', borderTop: `4px solid ${p.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${p.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: p.color,
                  fontWeight: 800
                }}>
                  {p.short}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{p.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.percentage}% of total spend</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', marginBottom: '10px' }}>
              ${p.cost ? p.cost.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
            </div>

            <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${p.percentage}%`,
                background: p.color,
                borderRadius: '3px'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
