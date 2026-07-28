import React, { useState } from 'react';
import { Lightbulb, Zap, ArrowRight, CheckCircle2, ShieldCheck, DollarSign, Cpu } from 'lucide-react';

export default function AiSavingsAssistant({ aiRecommendations }) {
  const [executedItems, setExecutedItems] = useState({});

  if (!aiRecommendations || aiRecommendations.length === 0) return null;

  const handleExecute = (id) => {
    setExecutedItems(prev => ({ ...prev, [id]: true }));
  };

  const totalPotentialSavings = aiRecommendations.reduce((acc, r) => acc + r.estimatedMonthlySavings, 0);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={22} color="#F59E0B" />
            AI Money-Saving Recommendations (How to Reduce Bill)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Intelligent recommendations with step-by-step guidance on how to optimize compute & storage costs
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
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Actionable Savings</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>
              ${totalPotentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })} / month
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {aiRecommendations.map((item) => {
          const isDone = executedItems[item.id];

          return (
            <div key={item.id} className="glass-card-interactive" style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              opacity: isDone ? 0.6 : 1
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)' }}>
                    {item.provider} • {item.category}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#34D399' }}>
                    Save ${item.estimatedMonthlySavings.toFixed(2)}/mo
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                  {item.title}
                </h4>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                  Resource: {item.resourceName}
                </div>

                {item.currentCost && item.newCost && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    marginBottom: '12px'
                  }}>
                    <span style={{ color: '#F87171' }}>Current: <strong>{item.currentCost}</strong></span>
                    <span style={{ color: '#34D399' }}>Optimized: <strong>{item.newCost}</strong></span>
                  </div>
                )}

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderLeft: '3px solid #F59E0B',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.825rem',
                  color: '#E5E7EB',
                  lineHeight: 1.45,
                  marginBottom: '16px'
                }}>
                  💡 <strong>How to Save:</strong> {item.howToSave}
                </div>
              </div>

              <button
                onClick={() => handleExecute(item.id)}
                disabled={isDone}
                className={isDone ? 'btn-secondary' : 'btn-primary'}
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
              >
                {isDone ? (
                  <>
                    <CheckCircle2 size={16} color="#34D399" />
                    Optimization Action Executed
                  </>
                ) : (
                  <>
                    {item.actionStep}
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
