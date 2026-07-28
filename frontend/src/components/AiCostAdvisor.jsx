import React, { useState } from 'react';
import { Bot, TrendingUp, HelpCircle, ArrowRight, CheckCircle2, Zap, AlertTriangle } from 'lucide-react';

export default function AiCostAdvisor({ aiCostAdvisor }) {
  const [executedItems, setExecutedItems] = useState({});

  if (!aiCostAdvisor || aiCostAdvisor.length === 0) return null;

  const handleExecute = (id) => {
    setExecutedItems(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(255, 153, 0, 0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={22} color="#FF9900" />
            AI Cost Advisor (Cost Increase Explanations)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Instead of just showing costs, we analyze why expenses increased and provide suggested actions
          </p>
        </div>

        <span className="badge badge-aws">
          <Zap size={12} /> INTELLIGENT COST ANALYSIS
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {aiCostAdvisor.map((item) => {
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
                {/* Header Badge & Provider */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className={`badge badge-${item.provider.toLowerCase()}`}>
                    {item.provider} • {item.serviceName}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> +{item.increasePercentage}% Increase
                  </span>
                </div>

                {/* Main Increase Statement */}
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginBottom: '12px', lineHeight: 1.3 }}>
                  {item.serviceName} cost increased by <span style={{ color: '#F87171' }}>{item.increasePercentage}%</span>
                </h4>

                {/* Possible Reasons List */}
                <div style={{
                  background: 'rgba(10, 13, 20, 0.7)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '14px'
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FBBF24', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle size={14} /> Possible reasons:
                  </div>
                  <ul style={{ listStyleType: 'none', paddingLeft: 0, fontSize: '0.825rem', color: '#D1D5DB', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(item.reasons || []).map((reason, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ color: '#FF9900', fontWeight: 800 }}>•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Action Box */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderLeft: '4px solid #10B981',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.85rem',
                  color: '#E5E7EB',
                  lineHeight: 1.45,
                  marginBottom: '18px'
                }}>
                  💡 <strong>Suggested action:</strong> {item.suggestedAction}
                </div>
              </div>

              {/* Interactive Action Button */}
              <button
                onClick={() => handleExecute(item.id)}
                disabled={isDone}
                className={isDone ? 'btn-secondary' : 'btn-primary'}
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
              >
                {isDone ? (
                  <>
                    <CheckCircle2 size={16} color="#34D399" />
                    Action Executed
                  </>
                ) : (
                  <>
                    {item.actionLabel}
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
