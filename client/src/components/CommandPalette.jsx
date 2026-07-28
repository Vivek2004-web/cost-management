import React, { useState, useEffect } from 'react';
import { Search, Command, X, ArrowRight, Zap, Shield, Layers, Users, Bot, CheckSquare, Bell, FileText, Settings } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onSelectModule, onRunQuickAction }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectModule('COMMAND_PALETTE_OPEN');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectModule]);

  if (!isOpen) return null;

  const items = [
    { id: 'overview', title: 'Executive Overview', category: 'Module', icon: Zap, action: () => onSelectModule('overview') },
    { id: 'inventory', title: 'Resource Inventory (EC2, RDS, S3)', category: 'Module', icon: Layers, action: () => onSelectModule('inventory') },
    { id: 'advisor', title: 'AI Cost Advisor', category: 'Module', icon: Bot, action: () => onSelectModule('advisor') },
    { id: 'carbon', title: 'Carbon Impact & Green Score', category: 'Module', icon: Shield, action: () => onSelectModule('carbon') },
    { id: 'automation', title: 'Automation Center & Shutdown Rules', category: 'Module', icon: CheckSquare, action: () => onSelectModule('automation') },
    { id: 'timeline', title: 'Activity Timeline & Audit Log', category: 'Module', icon: FileText, action: () => onSelectModule('timeline') },
    { id: 'settings', title: 'Cloud Credentials & Settings', category: 'Module', icon: Settings, action: () => onSelectModule('settings') },
    { id: 'action-export-pdf', title: 'Export PDF Financial Report', category: 'Quick Action', icon: FileText, action: () => onRunQuickAction('EXPORT_PDF') },
    { id: 'action-refresh', title: 'Refresh Live Cloud Cost Metrics', category: 'Quick Action', icon: Zap, action: () => onRunQuickAction('REFRESH') }
  ];

  const filteredItems = items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '100px',
      zIndex: 99999
    }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '640px', width: '100%', padding: '0', overflow: 'hidden', border: '1px solid rgba(255, 153, 0, 0.3)' }}>
        
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)', gap: '12px' }}>
          <Search size={20} color="#FF9900" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search modules... (Press Esc to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Search Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '12px' }}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => { item.action(); onClose(); }}
                  className="glass-card-interactive"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconComp size={18} color="#FF9900" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFF' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              );
            })
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No matching modules or actions found for "{query}".
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div style={{ padding: '10px 20px', background: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Navigation Shortcut: <strong>Ctrl + K</strong></span>
          <span>Enterprise CloudOps Platform</span>
        </div>

      </div>
    </div>
  );
}
