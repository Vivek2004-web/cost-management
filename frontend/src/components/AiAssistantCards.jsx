import React, { useState } from 'react';
import { Bot, Cpu, Zap, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AiAssistantCards({ aiRecommendations, currencySymbol }) {
  const [executedItems, setExecutedItems] = useState({});
  const symbol = currencySymbol || '₹';

  const handleExecute = (id) => {
    setExecutedItems(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={22} color="#10B981" />
            AI FinOps Optimization Assistant
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Intelligent resource utilization assistant providing active cost optimization recommendations
          </p>
        </div>

        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' }}>
          <Zap size={14} /> AUTONOMOUS ENGINE ACTIVE
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {(aiRecommendations || []).map((item) => {
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
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#34D399' }}>
                    Save {symbol}{item.estimatedMonthlySavings.toLocaleString()}/mo
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
                  {item.title}
                </h4>

                {item.cpuUtilization && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#F87171',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    fontWeight: 700
                  }}>
                    <Cpu size={12} /> Avg CPU Utilization: {item.cpuUtilization} ({item.observationPeriod})
                  </div>
                )}

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderLeft: '3px solid #10B981',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.825rem',
                  color: '#E5E7EB',
                  lineHeight: 1.4,
                  marginBottom: '16px'
                }}>
                  🤖 <strong>AI Insight:</strong> {item.recommendation}
                </div>
              </div>

              <button
                onClick={() => handleExecute(item.id)}
                disabled={isDone}
                className={isDone ? 'btn-secondary' : 'btn-primary'}
                style={{ width: '100%', padding: '9px', fontSize: '0.85rem' }}
              >
                {isDone ? (
                  <>
                    <CheckCircle2 size={16} color="#34D399" /> Downsizing Script Executed
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
