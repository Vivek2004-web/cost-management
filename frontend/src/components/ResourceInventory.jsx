import React, { useState, useEffect } from 'react';
import { Layers, Search, Loader2, RefreshCw, Server } from 'lucide-react';

export default function ResourceInventory({ token }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchResources = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/costs/resources', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.resources) {
        setResources(data.resources);
        setIsDemo(data.isDemo ?? false);
      } else {
        setErrorMessage(data.message || 'Failed to fetch resources');
      }
    } catch (err) {
      console.error('Resource fetch error:', err);
      setErrorMessage('Network error fetching resource inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchResources();
    }
  }, [token]);

  const filteredResources = resources.filter(r => {
    const matchesSearch = (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === 'ALL' || (r.service || '').toUpperCase().includes(serviceFilter);
    return matchesSearch && matchesService;
  });

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="#38BDF8" />
              Live Infrastructure Resource Inventory
            </h3>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '20px',
              background: isDemo ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: isDemo ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
              color: isDemo ? '#FBBF24' : '#34D399'
            }}>
              {isDemo ? '✨ DEMO MODE' : '🟢 LIVE AWS EC2 INVENTORY'}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time infrastructure inventory fetched directly from your AWS EC2 account
          </p>
        </div>

        {/* Controls: Refresh, Search & Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={fetchResources}
            disabled={loading}
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '0.8rem' }}
            title="Refresh EC2 Resources"
          >
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
            Refresh
          </button>

          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search instance name or ID..."
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
                width: '230px'
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
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="spin-anim" style={{ marginBottom: '10px', color: '#38BDF8' }} />
          <p style={{ fontSize: '0.85rem' }}>Fetching live EC2 instance inventory from AWS...</p>
        </div>
      ) : errorMessage ? (
        <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#F87171', fontSize: '0.85rem' }}>
          {errorMessage}
        </div>
      ) : filteredResources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <Server size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p>No instances found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Instance Name & ID</th>
                <th style={{ padding: '12px 16px' }}>Provider / Type</th>
                <th style={{ padding: '12px 16px' }}>Availability Zone</th>
                <th style={{ padding: '12px 16px' }}>State</th>
                <th style={{ padding: '12px 16px' }}>Tags</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Est. Monthly Cost</th>
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
                    <span className={`badge badge-${(r.provider || 'aws').toLowerCase()}`}>
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
                      background: r.status === 'RUNNING' || r.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.2)',
                      color: r.status === 'RUNNING' || r.status === 'ACTIVE' ? '#34D399' : '#9CA3AF',
                      border: r.status === 'RUNNING' || r.status === 'ACTIVE' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)'
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(r.tags || []).map(t => (
                        <span key={t} style={{ fontSize: '0.675rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#FFF' }}>
                    ${(r.cost || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
