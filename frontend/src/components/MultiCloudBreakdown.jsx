import React, { useState } from 'react';
import {
  Layers, Scale, Zap, TrendingUp, Sparkles, Server, Database, HardDrive,
  BarChart3, Globe, CheckCircle2, ArrowRight, DollarSign, Sliders, Shield, AlertCircle
} from 'lucide-react';

export default function MultiCloudBreakdown({ cloudProviders }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'matrix', 'simulator'
  const [vmCount, setVmCount] = useState(25);
  const [dbCount, setDbCount] = useState(6);
  const [storageTb, setStorageTb] = useState(15);

  // Default provider fallback if none provided
  const providers = cloudProviders && cloudProviders.length >= 3 ? cloudProviders : [
    { name: 'Amazon Web Services (AWS)', short: 'AWS', cost: 1650.00, percentage: 52.9, color: '#FF9900', activeServices: 18, efficiencyScore: '88%' },
    { name: 'Microsoft Azure', short: 'Azure', cost: 940.00, percentage: 30.1, color: '#0089D6', activeServices: 12, efficiencyScore: '92%' },
    { name: 'Google Cloud Platform (GCP)', short: 'GCP', cost: 530.00, percentage: 17.0, color: '#4285F4', activeServices: 8, efficiencyScore: '95%' }
  ];

  const totalSpend = providers.reduce((sum, p) => sum + (p.cost || 0), 0);

  // Multi-Cloud Side-by-Side Service Cost Matrix
  const serviceMatrix = [
    {
      category: 'Virtual Compute & VMs',
      icon: Server,
      aws: { service: 'AWS EC2 Compute', cost: 890.00, unitCost: '$0.0416/hr (t3.medium)' },
      azure: { service: 'Azure Virtual Machines', cost: 580.00, unitCost: '$0.0432/hr (B2s)' },
      gcp: { service: 'GCP Compute Engine', cost: 340.00, unitCost: '$0.0384/hr (e2-standard-2)' },
      bestValue: 'GCP',
      savingsDelta: '-14% unit cost vs Azure'
    },
    {
      category: 'Managed Relational Databases',
      icon: Database,
      aws: { service: 'AWS RDS Postgres', cost: 480.00, unitCost: '$0.0680/hr (db.t3.medium)' },
      azure: { service: 'Azure SQL Database', cost: 360.00, unitCost: '$0.0625/hr (vCore 2)' },
      gcp: { service: 'GCP Cloud SQL', cost: 210.00, unitCost: '$0.0650/hr (db-custom-2)' },
      bestValue: 'Azure',
      savingsDelta: '-8% vs AWS RDS'
    },
    {
      category: 'Object Cloud Storage',
      icon: HardDrive,
      aws: { service: 'AWS S3 Standard', cost: 280.00, unitCost: '$0.0230/GB' },
      azure: { service: 'Azure Blob Hot', cost: 190.00, unitCost: '$0.0210/GB' },
      gcp: { service: 'GCP Cloud Storage Standard', cost: 150.00, unitCost: '$0.0200/GB' },
      bestValue: 'GCP',
      savingsDelta: '-13% vs AWS S3'
    },
    {
      category: 'Enterprise Data Warehouse',
      icon: BarChart3,
      aws: { service: 'AWS Redshift Serverless', cost: 210.00, unitCost: '$0.375/RPU-hr' },
      azure: { service: 'Azure Synapse Analytics', cost: 180.00, unitCost: '$1.20/DWU-100' },
      gcp: { service: 'GCP BigQuery Data Warehouse', cost: 190.00, unitCost: '$6.25/TB Scanned' },
      bestValue: 'Azure',
      savingsDelta: '-5% workload cost'
    },
    {
      category: 'Global Network & Data Egress',
      icon: Globe,
      aws: { service: 'AWS CloudFront & Direct Connect', cost: 140.00, unitCost: '$0.085/GB Egress' },
      azure: { service: 'Azure Front Door & ExpressRoute', cost: 110.00, unitCost: '$0.081/GB Egress' },
      gcp: { service: 'GCP Cloud CDN & Interconnect', cost: 90.00, unitCost: '$0.075/GB Egress' },
      bestValue: 'GCP',
      savingsDelta: '-12% Egress Rate'
    }
  ];

  // Workload Simulator Price Calculations
  // AWS baseline: $35/VM, $70/DB, $20/TB
  const simulatedAwsCost = (vmCount * 35.60) + (dbCount * 72.00) + (storageTb * 23.00);
  const simulatedAzureCost = (vmCount * 36.80) + (dbCount * 65.50) + (storageTb * 21.00);
  const simulatedGcpCost = (vmCount * 32.40) + (dbCount * 68.00) + (storageTb * 20.00);

  const cheapestSimulated = Math.min(simulatedAwsCost, simulatedAzureCost, simulatedGcpCost);
  const cheapestProvider = cheapestSimulated === simulatedGcpCost ? 'GCP' : (cheapestSimulated === simulatedAzureCost ? 'Azure' : 'AWS');

  return (
    <div style={{ marginBottom: '32px' }} className="animate-fade-in">
      {/* ── Section Header & View Mode Switcher ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B82F6'
            }}>
              <Scale size={20} />
            </div>
            Multi-Cloud Provider Comparison & Arbitrage Hub
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Compare real-time spending, unit rates, and workload pricing across AWS, Azure, and GCP simultaneously
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '3px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            style={{
              background: activeTab === 'overview' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'overview' ? 'var(--accent-green)' : 'var(--text-muted)',
              border: activeTab === 'overview' ? '1px solid rgba(0,255,135,0.4)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={14} /> Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            style={{
              background: activeTab === 'matrix' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'matrix' ? 'var(--accent-green)' : 'var(--text-muted)',
              border: activeTab === 'matrix' ? '1px solid rgba(0,255,135,0.4)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Scale size={14} /> Service Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            style={{
              background: activeTab === 'simulator' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'simulator' ? 'var(--accent-green)' : 'var(--text-muted)',
              border: activeTab === 'simulator' ? '1px solid rgba(0,255,135,0.4)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sliders size={14} /> Workload Simulator
          </button>
        </div>
      </div>

      {/* ── TAB 1: EXECUTIVE OVERVIEW CARDS ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Provider Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            {providers.map((p) => {
              const dailyRate = (p.cost / 30).toFixed(2);
              return (
                <div
                  key={p.short}
                  className="glass-card-interactive"
                  style={{
                    padding: '24px',
                    borderTop: `4px solid ${p.color}`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: `${p.color}20`,
                        border: `1px solid ${p.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: p.color,
                        fontWeight: 900,
                        fontSize: '0.95rem'
                      }}>
                        {p.short}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{p.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.activeServices || 12} Active Cloud Services
                        </span>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: `${p.color}20`,
                      color: p.color,
                      border: `1px solid ${p.color}40`
                    }}>
                      {p.percentage}% SHARE
                    </span>
                  </div>

                  {/* Monthly Cost & Run Rate */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#FFF', letterSpacing: '-0.02em' }}>
                      ${p.cost ? p.cost.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>Run-rate: <strong>${dailyRate}/day</strong></span>
                      <span>•</span>
                      <span>Efficiency: <strong style={{ color: '#34D399' }}>{p.efficiencyScore || '90%'}</strong></span>
                    </div>
                  </div>

                  {/* Visual Share Bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Budget Allocation</span>
                      <span>{p.percentage}% of ${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${p.percentage}%`,
                        background: p.color,
                        borderRadius: '4px',
                        boxShadow: `0 0 12px ${p.color}80`
                      }} />
                    </div>
                  </div>

                  {/* Quick Insight Badge */}
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Sparkles size={13} color={p.color} />
                    {p.short === 'AWS' && 'EC2 compute accounts for 53.9% of AWS spend'}
                    {p.short === 'Azure' && 'Virtual Machines & SQL db lead total usage'}
                    {p.short === 'GCP' && 'BigQuery data analytics offers lowest unit rate'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unified Multi-Cloud Arbitrage Bar */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="#00FF87" />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF' }}>Unified Multi-Cloud Distribution Ratio</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Monthly Portfolio: <strong style={{ color: '#00FF87' }}>${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </span>
            </div>

            <div style={{ height: '16px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', display: 'flex', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              {providers.map((p) => (
                <div
                  key={p.short}
                  style={{
                    width: `${p.percentage}%`,
                    background: p.color,
                    height: '100%',
                    title: `${p.name}: ${p.percentage}%`
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
              {providers.map((p) => (
                <div key={p.short} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: p.color }} />
                  <span style={{ color: 'var(--text-muted)' }}>{p.short}:</span>
                  <strong style={{ color: '#FFF' }}>${p.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({p.percentage}%)</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: SIDE-BY-SIDE SERVICE MATRIX ── */}
      {activeTab === 'matrix' && (
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF' }}>Cross-Cloud Service Cost Comparison Matrix</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Map equivalent services across AWS, Azure, and GCP to identify cost arbitrage opportunities</p>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(0, 255, 135, 0.15)', color: '#00FF87', borderRadius: '6px', fontWeight: 700 }}>
              ⚡ Real-Time Unit Rate Benchmark
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 700 }}>Cloud Service Category</th>
                <th style={{ padding: '12px 14px', color: '#FF9900', fontWeight: 800 }}>🟧 Amazon AWS</th>
                <th style={{ padding: '12px 14px', color: '#38BDF8', fontWeight: 800 }}>🟦 Microsoft Azure</th>
                <th style={{ padding: '12px 14px', color: '#60A5FA', fontWeight: 800 }}>🟨 Google GCP</th>
                <th style={{ padding: '12px 14px', color: '#00FF87', fontWeight: 800 }}>Best Value</th>
              </tr>
            </thead>
            <tbody>
              {serviceMatrix.map((row, idx) => {
                const IconComponent = row.icon;
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconComponent size={16} color="#3B82F6" />
                      {row.category}
                    </td>

                    {/* AWS */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 800, color: '#FFF' }}>${row.aws.cost.toFixed(2)}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{row.aws.service}</div>
                      <div style={{ fontSize: '0.68rem', color: '#FF9900', marginTop: '2px' }}>{row.aws.unitCost}</div>
                    </td>

                    {/* Azure */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 800, color: '#FFF' }}>${row.azure.cost.toFixed(2)}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{row.azure.service}</div>
                      <div style={{ fontSize: '0.68rem', color: '#38BDF8', marginTop: '2px' }}>{row.azure.unitCost}</div>
                    </td>

                    {/* GCP */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 800, color: '#FFF' }}>${row.gcp.cost.toFixed(2)}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{row.gcp.service}</div>
                      <div style={{ fontSize: '0.68rem', color: '#60A5FA', marginTop: '2px' }}>{row.gcp.unitCost}</div>
                    </td>

                    {/* Best Value */}
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: 'rgba(0, 255, 135, 0.15)',
                        color: '#00FF87',
                        border: '1px solid rgba(0, 255, 135, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle2 size={12} /> {row.bestValue}
                      </span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {row.savingsDelta}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB 3: WORKLOAD COST SIMULATOR & ARBITRAGE ── */}
      {activeTab === 'simulator' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#00FF87" /> Multi-Cloud Workload Pricing Simulator
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Adjust your infrastructure requirements to compare total monthly cost across AWS, Azure, and GCP</p>
            </div>
            <div style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'rgba(0, 255, 135, 0.15)',
              border: '1px solid rgba(0,255,135,0.3)',
              color: '#00FF87',
              fontSize: '0.8rem',
              fontWeight: 800
            }}>
              🏆 Lowest Cost Provider: {cheapestProvider}
            </div>
          </div>

          {/* Sliders Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
                <span>🖥️ Virtual Compute (VMs):</span>
                <strong style={{ color: '#00FF87' }}>{vmCount} Instances</strong>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={vmCount}
                onChange={(e) => setVmCount(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#00FF87', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>t3.medium / B2s / e2-standard-2 equivalent</div>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
                <span>🗄️ Relational Databases:</span>
                <strong style={{ color: '#00FF87' }}>{dbCount} DB Nodes</strong>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={dbCount}
                onChange={(e) => setDbCount(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#00FF87', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Managed PostgreSQL / MySQL Nodes</div>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
                <span>💾 Object Storage Capacity:</span>
                <strong style={{ color: '#00FF87' }}>{storageTb} TB</strong>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={storageTb}
                onChange={(e) => setStorageTb(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#00FF87', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>S3 / Blob / Cloud Storage Standard</div>
            </div>
          </div>

          {/* Simulator Result Comparison Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            {/* AWS Simulated */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: cheapestProvider === 'AWS' ? 'rgba(255, 153, 0, 0.12)' : 'rgba(255,255,255,0.03)',
              border: cheapestProvider === 'AWS' ? '2px solid #FF9900' : '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FF9900' }}>🟧 AWS Estimate</span>
                {cheapestProvider === 'AWS' && <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: '#FF9900', color: '#000', fontWeight: 900, borderRadius: '4px' }}>LOWEST COST</span>}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFF' }}>
                ${simulatedAwsCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Compute: ${(vmCount * 35.6).toFixed(0)} | DB: ${(dbCount * 72).toFixed(0)} | Storage: ${(storageTb * 23).toFixed(0)}
              </div>
            </div>

            {/* Azure Simulated */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: cheapestProvider === 'Azure' ? 'rgba(0, 137, 214, 0.12)' : 'rgba(255,255,255,0.03)',
              border: cheapestProvider === 'Azure' ? '2px solid #0089D6' : '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38BDF8' }}>🟦 Azure Estimate</span>
                {cheapestProvider === 'Azure' && <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: '#38BDF8', color: '#000', fontWeight: 900, borderRadius: '4px' }}>LOWEST COST</span>}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFF' }}>
                ${simulatedAzureCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Compute: ${(vmCount * 36.8).toFixed(0)} | DB: ${(dbCount * 65.5).toFixed(0)} | Storage: ${(storageTb * 21).toFixed(0)}
              </div>
            </div>

            {/* GCP Simulated */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: cheapestProvider === 'GCP' ? 'rgba(66, 133, 244, 0.12)' : 'rgba(255,255,255,0.03)',
              border: cheapestProvider === 'GCP' ? '2px solid #4285F4' : '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#60A5FA' }}>🟨 GCP Estimate</span>
                {cheapestProvider === 'GCP' && <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: '#60A5FA', color: '#000', fontWeight: 900, borderRadius: '4px' }}>LOWEST COST</span>}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFF' }}>
                ${simulatedGcpCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Compute: ${(vmCount * 32.4).toFixed(0)} | DB: ${(dbCount * 68).toFixed(0)} | Storage: ${(storageTb * 20).toFixed(0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
