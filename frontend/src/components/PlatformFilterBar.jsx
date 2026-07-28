import React from 'react';
import { Layers, Cloud, Filter } from 'lucide-react';

export default function PlatformFilterBar({ selectedPlatform, onSelectPlatform }) {
  return (
    <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Filter size={18} color="#FF9900" />
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Cloud Platform Filter:
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          (Select platform to isolate specific cloud metrics)
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onSelectPlatform('ALL')}
          className={`platform-pill ${selectedPlatform === 'ALL' ? 'active-all' : ''}`}
        >
          <Layers size={16} /> All Multi-Cloud
        </button>

        <button
          onClick={() => onSelectPlatform('AWS')}
          className={`platform-pill ${selectedPlatform === 'AWS' ? 'active-aws' : ''}`}
        >
          🟧 AWS
        </button>

        <button
          onClick={() => onSelectPlatform('AZURE')}
          className={`platform-pill ${selectedPlatform === 'AZURE' ? 'active-azure' : ''}`}
        >
          🟦 Azure
        </button>

        <button
          onClick={() => onSelectPlatform('GCP')}
          className={`platform-pill ${selectedPlatform === 'GCP' ? 'active-gcp' : ''}`}
        >
          🟩 GCP
        </button>
      </div>
    </div>
  );
}
