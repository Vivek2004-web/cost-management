import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

export default function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState('amber');

  const themes = [
    { id: 'amber', name: 'Neon Amber', color: '#FF9900', secondary: '#E67E00' },
    { id: 'cyan', name: 'Cyber Cyan', color: '#0089D6', secondary: '#005BA1' },
    { id: 'green', name: 'Emerald Eco', color: '#10B981', secondary: '#059669' },
    { id: 'violet', name: 'Electric Violet', color: '#8B5CF6', secondary: '#7C3AED' }
  ];

  const handleApplyTheme = (theme) => {
    setSelectedTheme(theme.id);
    document.documentElement.style.setProperty('--accent-primary', theme.color);
    document.documentElement.style.setProperty('--primary-glow', `${theme.color}40`);
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Palette size={18} color="#FF9900" />
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Dashboard Accent Customizer:
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {themes.map((t) => {
          const isSelected = selectedTheme === t.id;

          return (
            <button
              key={t.id}
              onClick={() => handleApplyTheme(t)}
              style={{
                background: isSelected ? `${t.color}25` : 'rgba(255,255,255,0.03)',
                border: isSelected ? `1px solid ${t.color}` : '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '6px 14px',
                color: isSelected ? t.color : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color }} />
              {t.name}
              {isSelected && <Check size={12} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
