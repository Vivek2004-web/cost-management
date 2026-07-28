import React, { useState } from 'react';
import { Lightbulb, ArrowRight, Zap, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

export default function Recommendations({ recommendations, totalPotentialSavings }) {
  const [appliedItems, setAppliedItems] = useState({});

  const handleApply = (id) => {
    setAppliedItems(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} color="#F59E0B" />
            AI Cost Optimization Recommendations
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Automated recommendations to reduce monthly AWS bill
          </p>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Zap size={20} color="#34D399" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Monthly Savings</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>
              ${totalPotentialSavings ? totalPotentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '1,310.50'} / mo
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {(recommendations || []).map((item) => {
          const isDone = appliedItems[item.id];

          return (
            <div key={item.id} className="glass-card-interactive" style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              opacity: isDone ? 0.6 : 1
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge" style={{ background: 'rgba(255, 153, 0, 0.15)', color: '#FF9900', border: '1px solid rgba(255,153,0,0.3)' }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    +${item.estimatedMonthlySavings.toFixed(2)}/mo
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                  {item.description}
                </p>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  borderLeft: '3px solid #3B82F6',
                  fontSize: '0.775rem',
                  color: '#D1D5DB',
                  marginBottom: '16px'
                }}>
                  💡 {item.recommendation}
                </div>
              </div>

              <button
                onClick={() => handleApply(item.id)}
                disabled={isDone}
                className={isDone ? 'btn-secondary' : 'btn-primary'}
                style={{ width: '100%', padding: '9px', fontSize: '0.85rem' }}
              >
                {isDone ? (
                  <>
                    <CheckCircle2 size={16} color="#34D399" />
                    Applied & Scheduled
                  </>
                ) : (
                  <>
                    {item.actionType || 'Optimize Now'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
