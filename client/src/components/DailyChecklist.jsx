import React from 'react';
import { CheckSquare, Square, Zap, ShieldCheck, RefreshCw } from 'lucide-react';

export default function DailyChecklist({ checklistData, onToggleTask, currencySymbol }) {
  if (!checklistData) return null;
  const { tasks, summary } = checklistData;
  const symbol = currencySymbol || '₹';

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={20} color="#F59E0B" />
            Daily Action-Oriented Optimization Checklist
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Daily FinOps task list to eliminate cloud waste step-by-step
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Completed: <strong style={{ color: '#34D399' }}>{summary?.completedCount || 0} / {summary?.totalTasks || 0}</strong>
          </div>
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#FBBF24'
          }}>
            Captured Savings: {symbol}{summary?.completedSavings?.toLocaleString() || 0} / {symbol}{summary?.totalPotentialSavings?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{
          height: '100%',
          width: `${summary?.progressPercentage || 0}%`,
          background: 'linear-gradient(90deg, #F59E0B 0%, #10B981 100%)',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Checklist Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
        {(tasks || []).map((t) => (
          <div
            key={t.id}
            onClick={() => onToggleTask(t.id)}
            style={{
              background: t.isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${t.isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textDecoration: t.isCompleted ? 'line-through' : 'none',
              opacity: t.isCompleted ? 0.7 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {t.isCompleted ? (
                <CheckSquare size={20} color="#34D399" style={{ flexShrink: 0 }} />
              ) : (
                <Square size={20} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: t.isCompleted ? 'var(--text-muted)' : 'var(--text-main)' }}>
                  {t.taskName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Category: {t.category}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: t.isCompleted ? '#34D399' : '#FBBF24', whiteSpace: 'nowrap' }}>
              +{symbol}{t.estimatedSavings.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
