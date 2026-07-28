import React from 'react';
import { Leaf, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CarbonImpact() {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Leaf size={22} color="#34D399" />
            Cloud Carbon Impact & Sustainability Center
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Track estimated carbon emissions (CO₂) and green cloud energy efficiency score
          </p>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '12px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldCheck size={18} color="#34D399" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34D399' }}>
            GREEN EFFICIENCY SCORE: 88/100
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Est. Monthly CO₂ Emissions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399' }}>
            4.2 Metric Tons
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '4px', fontWeight: 700 }}>
            -14% reduction vs last month
          </div>
        </div>

        <div style={{ background: 'rgba(10, 13, 20, 0.6)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Clean Energy Utilization</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            91.4%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Powered by renewable data centers
          </div>
        </div>
      </div>

      {/* Green Recommendations */}
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '12px' }}>🌱 Green Sustainability Recommendations</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF', marginBottom: '4px' }}>
            Migrate x86 EC2 to Graviton3 (ARM Architecture)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            AWS Graviton3 processors use up to 60% less energy for the same workload compared to comparable x86 instances.
          </div>
          <button className="btn-secondary" style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }}>
            View Migration Guide
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF', marginBottom: '4px' }}>
            Auto-Schedule Weekend Environment Shutdown
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Stopping non-production environments during non-business hours reduces compute carbon footprint by ~28%.
          </div>
          <button className="btn-secondary" style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }}>
            Enable Auto-Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
