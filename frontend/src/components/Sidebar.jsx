import React from 'react';
import {
  Zap, Bot, Target, AlertTriangle, PieChart, Layers, Settings, ChevronLeft, ChevronRight, Cloud
} from 'lucide-react';

export default function Sidebar({ collapsed, onToggleCollapse, activeModule, onSelectModule }) {
  const navigationItems = [
    { id: 'overview',   label: 'Overview',          icon: Zap,           badge: null },
    { id: 'charts',     label: 'Cost Charts',        icon: PieChart,      badge: null },
    { id: 'budgets',    label: 'Budget Tracker',     icon: Target,        badge: null },
    { id: 'advisor',    label: 'AI Advisor',         icon: Bot,           badge: 'SAVE $1.3K' },
    { id: 'inventory',  label: 'Resource Inventory', icon: Layers,        badge: null },
    { id: 'anomalies',  label: 'Anomaly Alerts',     icon: AlertTriangle, badge: '2 SPIKES' },
    { id: 'settings',   label: 'Settings',           icon: Settings,      badge: null },
  ];

  return (
    <aside style={{
      width: collapsed ? '72px' : '260px',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: 'rgba(5, 12, 8, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border-color)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div>
        {/* Brand Header */}
        <div style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00FF87 0%, #10B981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(0, 255, 135, 0.5)',
              flexShrink: 0
            }}>
              <Cloud size={20} color="#05070A" />
            </div>
            {!collapsed && (
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #00FF87 0%, #34D399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Cloucal
              </span>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: collapsed ? 'none' : 'block' }}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                style={{
                  background: isActive ? 'linear-gradient(90deg, rgba(0, 255, 135, 0.18) 0%, rgba(0, 255, 135, 0.03) 100%)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(0, 255, 135, 0.45)' : 'transparent',
                  borderRadius: '10px',
                  padding: collapsed ? '12px 0' : '10px 14px',
                  color: isActive ? '#00FF87' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  width: '100%'
                }}
                title={collapsed ? item.label : ''}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <IconComponent size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                  )}
                </div>

                {!collapsed && item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: isActive ? 'rgba(0, 255, 135, 0.25)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#00FF87' : 'var(--text-muted)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapse Toggle Footer */}
      {collapsed && (
        <div style={{ padding: '16px 0', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={onToggleCollapse} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}
