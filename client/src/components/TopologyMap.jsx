import React, { useState } from 'react';
import { Network, Server, Database, HardDrive, Cpu, ShieldCheck, Activity, Info } from 'lucide-react';

export default function TopologyMap() {
  const [selectedNode, setSelectedNode] = useState('ec2-1');

  const nodes = [
    { id: 'gateway', name: 'Multi-Cloud Transit Gateway', type: 'Gateway', provider: 'ALL', region: 'Global', status: 'HEALTHY', burnRate: '$4.25/hr', cpu: '12%', memory: '24%', details: 'Global Multi-Cloud routing and ingress gateway.' },
    { id: 'ec2-1', name: 'prod-api-ec2-cluster', type: 'EC2', provider: 'AWS', region: 'us-east-1', status: 'HEALTHY', burnRate: '$0.58/hr', cpu: '14.2%', memory: '48.5%', details: 'Primary API server cluster (t3.xlarge nodes).' },
    { id: 'rds-1', name: 'prod-db-postgres-primary', type: 'RDS', provider: 'AWS', region: 'us-east-1', status: 'HEALTHY', burnRate: '$0.66/hr', cpu: '38.4%', memory: '72.1%', details: 'Multi-AZ PostgreSQL production database engine.' },
    { id: 's3-1', name: 's3-analytics-raw-logs', type: 'S3', provider: 'AWS', region: 'us-west-2', status: 'HEALTHY', burnRate: '$0.38/hr', cpu: 'N/A', memory: '8.4 TB', details: 'S3 storage bucket containing analytics log files.' },
    { id: 'azure-1', name: 'az-staging-web-frontend', type: 'Azure VM', provider: 'Azure', region: 'eastus', status: 'IDLE', burnRate: '$0.79/hr', cpu: '6.2%', memory: '34.0%', details: 'Staging web application virtual machines.' },
    { id: 'gcp-1', name: 'gcp-k8s-node-pool-01', type: 'GCP Engine', provider: 'GCP', region: 'us-central1', status: 'HEALTHY', burnRate: '$0.46/hr', cpu: '54.0%', memory: '68.0%', details: 'Google Kubernetes Engine (GKE) worker pool.' }
  ];

  const activeNodeObj = nodes.find(n => n.id === selectedNode) || nodes[1];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={22} color="#38BDF8" />
            Interactive Cloud Infrastructure Topology Map
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Visual topology map connecting multi-cloud gateways, compute instances, databases, and storage buckets
          </p>
        </div>

        <span className="badge badge-azure">
          <Activity size={12} /> LIVE TOPOLOGY SCAN
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Topology Node Canvas Visual */}
        <div style={{ background: 'rgba(10, 13, 20, 0.7)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Click node to inspect metrics & burn rate</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {nodes.map((node) => {
              const isSelected = node.id === selectedNode;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid #38BDF8' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className={`badge badge-${node.provider.toLowerCase()}`}>
                      {node.provider}
                    </span>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: node.status === 'HEALTHY' ? '#34D399' : '#FBBF24' }} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {node.name}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#38BDF8', fontWeight: 700, marginTop: '4px' }}>
                    {node.burnRate}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Node Inspection Details Card */}
        <div style={{ background: 'rgba(10, 13, 20, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className={`badge badge-${activeNodeObj.provider.toLowerCase()}`}>
                {activeNodeObj.provider} • {activeNodeObj.type}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34D399' }}>
                {activeNodeObj.status}
              </span>
            </div>

            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
              {activeNodeObj.name}
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {activeNodeObj.details}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hourly Burn Rate</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8' }}>
                  {activeNodeObj.burnRate}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Region</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
                  {activeNodeObj.region}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CPU Utilization</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
                  {activeNodeObj.cpu}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Memory / Storage</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
                  {activeNodeObj.memory}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} color="#38BDF8" /> Real-time telemetry connection active
          </div>
        </div>

      </div>
    </div>
  );
}
