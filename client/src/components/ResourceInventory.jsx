import React, { useState } from 'react';
import { Layers, Search, Cpu, HardDrive, Tag, Filter, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ResourceInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  const resources = [
    { id: 'i-09abf721c810a42e1', name: 'prod-api-cluster-worker-01', service: 'EC2', provider: 'AWS', region: 'us-east-1', status: 'RUNNING', cost: 420.00, cpu: '14.2%', memory: '48.5%', tags: ['env:prod', 'team:engineering'] },
    { id: 'i-077cc21bb998810a2', name: 'prod-api-cluster-worker-02', service: 'EC2', provider: 'AWS', region: 'us-east-1', status: 'IDLE', cost: 420.00, cpu: '4.1%', memory: '22.0%', tags: ['env:prod', 'team:engineering'] },
    { id: 'rds-prod-postgres-main', name: 'prod-db-postgres-primary', service: 'RDS', provider: 'AWS', region: 'us-east-1', status: 'RUNNING', cost: 480.00, cpu: '38.4%', memory: '72.1%', tags: ['env:prod', 'team:database'] },
    { id: 's3-analytics-logs-2026', name: 's3-analytics-raw-logs', service: 'S3', provider: 'AWS', region: 'us-west-2', status: 'ACTIVE', cost: 280.00, cpu: 'N/A', memory: '8.4 TB', tags: ['env:prod', 'team:analytics'] },
    { id: 'lambda-auth-verify-user', name: 'auth-jwt-verifier-func', service: 'Lambda', provider: 'AWS', region: 'us-east-1', status: 'RUNNING', cost: 65.00, cpu: '2.1%', memory: '128 MB', tags: ['env:prod', 'team:auth'] },
    { id: 'vm-azure-staging-app', name: 'az-staging-web-frontend', service: 'Azure VM', provider: 'Azure', region: 'eastus', status: 'IDLE', cost: 580.00, cpu: '6.2%', memory: '34.0%', tags: ['env:staging', 'team:devops'] },
    { id: 'gcp-compute-worker-node', name: 'gcp-k8s-node-pool-01', service: 'GCP Engine', provider: 'GCP', region: 'us-central1', status: 'RUNNING', cost: 340.00, cpu: '54.0%', memory: '68.0%', tags: ['env:prod', 'team:infra'] }
  ];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === 'ALL' || r.service.toUpperCase().includes(serviceFilter);
    return matchesSearch && matchesService;
  });

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#38BDF8" />
            Searchable Multi-Cloud Resource Inventory
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time infrastructure inventory across EC2, RDS, S3, Lambda, Azure VMs & GCP Compute
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search resource name or ID..."
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
                width: '240px'
              }}
            />
          </div>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            style={{
              background: 'rgba(10, 13, 20, 0.9)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '8px 12px',
              color: '#FFF',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">All Services</option>
            <option value="EC2">EC2 Instances</option>
            <option value="RDS">RDS Databases</option>
            <option value="S3">S3 Buckets</option>
            <option value="LAMBDA">Lambda Functions</option>
            <option value="AZURE">Azure VMs</option>
            <option value="GCP">GCP Engine</option>
          </select>
        </div>
      </div>

      {/* Modern Resource Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Resource Name & ID</th>
              <th style={{ padding: '12px 16px' }}>Provider / Type</th>
              <th style={{ padding: '12px 16px' }}>Region</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>CPU Avg</th>
              <th style={{ padding: '12px 16px' }}>Memory</th>
              <th style={{ padding: '12px 16px' }}>Tags</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Monthly Cost</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s ease' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#FFF' }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{r.id}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`badge badge-${r.provider.toLowerCase()}`}>
                    {r.provider} • {r.service}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{r.region}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: r.status === 'RUNNING' || r.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: r.status === 'RUNNING' || r.status === 'ACTIVE' ? '#34D399' : '#FBBF24'
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: parseFloat(r.cpu) < 10 ? '#F87171' : '#E5E7EB' }}>
                  {r.cpu}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{r.memory}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {r.tags.map(t => (
                      <span key={t} style={{ fontSize: '0.675rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#FFF' }}>
                  ${r.cost.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
