import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', width: '100%' }}>
        {items.map((_, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden', minHeight: '120px' }}>
            <div style={{ width: '40%', height: '14px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', marginBottom: '16px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '70%', height: '28px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.12)', marginBottom: '12px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '50%', height: '12px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="glass-panel" style={{ padding: '24px', width: '100%', height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ width: '180px', height: '20px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.1)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
          <div style={{ width: '80px', height: '28px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '20px 0' }}>
          {[60, 40, 75, 50, 90, 65, 80, 45, 70, 85, 55, 95].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0', background: 'rgba(255, 255, 255, 0.08)', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', width: '100%' }}>
      {items.map((_, i) => (
        <div key={i} style={{ width: '100%', height: '20px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', marginBottom: '12px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
      ))}
    </div>
  );
}
