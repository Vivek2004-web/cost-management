import React from 'react';
import { Cloud, Sliders, LogOut, Mail, RefreshCw, Sparkles, ShieldCheck, Search, Play, Power } from 'lucide-react';

export default function Navbar({
  user,
  isDemoMode,
  credentialNotice,
  onOpenSettings,
  onOpenEmailAlerts,
  onOpenCommandPalette,
  onOpenQuickActions,
  onToggleDemoMode,
  onLogout,
  onRefresh,
  isRefreshing
}) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '14px 28px', marginBottom: '24px', position: 'sticky', top: 0, zIndex: 90 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Search Command Palette Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onOpenCommandPalette}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '8px 16px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              width: '260px'
            }}
          >
            <Search size={16} color="#00FF87" />
            <span style={{ flex: 1, textAlign: 'left' }}>Search modules...</span>
            <kbd style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', border: '1px solid var(--border-color)' }}>
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Mode Toggle Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onToggleDemoMode}
            style={{
              background: isDemoMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 255, 135, 0.15)',
              border: isDemoMode ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(0, 255, 135, 0.4)',
              borderRadius: '20px',
              padding: '6px 14px',
              color: isDemoMode ? '#FBBF24' : '#00FF87',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            title="Click to toggle between Live Credentials Calculation and Demo Mode"
          >
            {isDemoMode ? (
              <>
                <Sparkles size={14} /> DEMO SIMULATION (Click for Live)
              </>
            ) : (
              <>
                <ShieldCheck size={14} /> 🟢 LIVE CREDENTIALS CALCULATION
              </>
            )}
          </button>

          <span style={{
            background: 'rgba(0, 255, 135, 0.18)',
            border: '1px solid rgba(0, 255, 135, 0.45)',
            borderRadius: '20px',
            padding: '6px 14px',
            color: '#00FF87',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Zap size={14} /> ⚡ CI/CD AUTO-DEPLOYED
          </span>
        </div>

        {/* Action Controls & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          <button 
            onClick={onOpenQuickActions}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Play size={16} />
            Quick Actions
          </button>

          <button 
            onClick={onOpenSettings}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Sliders size={16} />
            API Credentials
          </button>

          <button 
            onClick={onRefresh} 
            disabled={isRefreshing}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Recalculate Cost Metrics"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin-anim' : ''} />
            {isRefreshing ? 'Recalculating...' : 'Refresh'}
          </button>

          <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00FF87 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#05070A'
            }}>
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="btn-secondary"
            style={{ padding: '8px', borderRadius: '10px', color: '#EF4444' }}
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>

      </div>
    </header>
  );
}
