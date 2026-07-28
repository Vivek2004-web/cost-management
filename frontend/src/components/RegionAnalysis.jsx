import React from 'react';
import { Globe, MapPin, TrendingUp } from 'lucide-react';

export default function RegionAnalysis() {
  const regions = [
    { code: 'us-east-1', name: 'US East (N. Virginia)', spend: 1840.00, percentage: 59.0, isHighest: true },
    { code: 'us-west-2', name: 'US West (Oregon)', spend: 720.00, percentage: 23.1, isHighest: false },
    { code: 'eu-west-1', name: 'Europe (Ireland)', spend: 380.00, percentage: 12.2, isHighest: false },
    { code: 'ap-south-1', name: 'Asia Pacific (Mumbai)', spend: 180.00, percentage: 5.7, isHighest: false }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={22} color="#38BDF8" />
            Global Regional Spending Distribution
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Cost analysis by AWS, Azure, and GCP cloud data center regions
          </p>
        </div>

        <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '10px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, color: '#38BDF8' }}>
          Top Region: us-east-1 (59.0%)
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {regions.map((r) => (
          <div key={r.code} className="glass-card-interactive" style={{ padding: '18px', borderTop: r.isHighest ? '4px solid #FF9900' : '4px solid #38BDF8' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>
                <MapPin size={16} color={r.isHighest ? '#FF9900' : '#38BDF8'} />
                {r.name}
              </div>
              {r.isHighest && (
                <span className="badge badge-aws">HIGHEST SPEND</span>
              )}
            </div>

            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
              ${r.spend.toFixed(2)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>{r.code}</span>
              <strong style={{ color: r.isHighest ? '#FF9900' : '#38BDF8' }}>{r.percentage}%</strong>
            </div>

            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${r.percentage}%`, height: '100%', background: r.isHighest ? '#FF9900' : '#38BDF8', borderRadius: '3px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
