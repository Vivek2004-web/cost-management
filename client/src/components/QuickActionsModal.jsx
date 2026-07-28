import React, { useState } from 'react';
import { Play, FileText, Download, Share2, RefreshCw, Zap, Plus, CheckCircle2, X } from 'lucide-react';

export default function QuickActionsModal({ isOpen, onClose, onRefreshData }) {
  const [notification, setNotification] = useState('');

  if (!isOpen) return null;

  const triggerAction = (label) => {
    setNotification(`Action Triggered: ${label}`);
    setTimeout(() => {
      setNotification('');
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '540px', width: '100%', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF9900 0%, #E67E00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A0D14'
          }}>
            <Play size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Enterprise Quick Actions & Reports</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Execute cloud operations, export reports, and refresh data</p>
          </div>
        </div>

        {notification && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34D399',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} /> {notification}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          
          <button
            onClick={() => triggerAction('Export PDF Financial Report')}
            className="glass-card-interactive"
            style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
            <Download size={20} color="#FF9900" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>Export PDF Report</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Executive PDF summary</div>
          </button>

          <button
            onClick={() => triggerAction('Export CSV Raw Billing Data')}
            className="glass-card-interactive"
            style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
            <FileText size={20} color="#3B82F6" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>Export CSV Data</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Raw line items CSV</div>
          </button>

          <button
            onClick={() => { onRefreshData(); triggerAction('Refresh Cost Data'); }}
            className="glass-card-interactive"
            style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
            <RefreshCw size={20} color="#34D399" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>Refresh Data</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sync cost metrics</div>
          </button>

          <button
            onClick={() => triggerAction('Generated AI FinOps Executive Summary')}
            className="glass-card-interactive"
            style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
            <Zap size={20} color="#8B5CF6" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>Generate AI Summary</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI FinOps analysis</div>
          </button>

        </div>

        <button onClick={onClose} className="btn-secondary" style={{ width: '100%', padding: '10px' }}>
          Close Modal
        </button>
      </div>
    </div>
  );
}
