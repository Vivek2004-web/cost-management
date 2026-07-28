import React, { useState } from 'react';
import { Target, Plus, Edit2, AlertCircle, ShieldAlert, CheckCircle, Trash2 } from 'lucide-react';

export default function BudgetTracker({ budgets, onAddBudget, onDeleteBudget }) {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Overall Cloud Spending');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('80');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!monthlyLimit || isNaN(monthlyLimit)) return;
    onAddBudget({ category, monthlyLimit: parseFloat(monthlyLimit), alertThreshold: parseInt(alertThreshold, 10) });
    setShowModal(false);
    setMonthlyLimit('');
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="#8B5CF6" />
            Budget Thresholds & Alerts
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Monitor spending limits and avoid unexpected billing spikes
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Plus size={16} /> Set Budget Target
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {budgets && budgets.length > 0 ? (
          budgets.map((b) => {
            const isExceeded = b.status === 'EXCEEDED';
            const isWarning = b.status === 'WARNING';

            return (
              <div key={b.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isExceeded ? 'rgba(239, 68, 68, 0.4)' : (isWarning ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-color)')}`,
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.category}</span>
                    {isExceeded ? (
                      <span className="badge badge-warning">
                        <AlertCircle size={12} /> EXCEEDED
                      </span>
                    ) : isWarning ? (
                      <span className="badge badge-demo">
                        <ShieldAlert size={12} /> WARNING ({b.usagePercentage}%)
                      </span>
                    ) : (
                      <span className="badge badge-live">
                        <CheckCircle size={12} /> ON TRACK
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                      ${b.currentSpending?.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      / ${b.monthlyLimit?.toLocaleString()} monthly cap
                    </span>
                  </div>

                  <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, b.usagePercentage)}%`,
                      background: isExceeded ? '#EF4444' : (isWarning ? '#F59E0B' : '#10B981'),
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>Alert triggered at <strong>{b.alertThreshold}%</strong> limit</span>
                  <button onClick={() => onDeleteBudget(b.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Delete Budget">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', gridColumn: '1/-1', textAlign: 'center', padding: '24px' }}>
            No custom budget limits configured yet. Click "Set Budget Target" to create one.
          </div>
        )}
      </div>

      {/* Modal for setting budget target */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Configure Budget Target</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Budget Category
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Monthly Spending Limit ($ USD)
                </label>
                <input
                  type="number"
                  required
                  placeholder="3000"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Alert Notification Threshold (%)
                </label>
                <select
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(10,13,20,0.9)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#FFF',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="50">50% of budget</option>
                  <option value="75">75% of budget</option>
                  <option value="80">80% of budget (Recommended)</option>
                  <option value="90">90% of budget</option>
                  <option value="100">100% of budget</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
