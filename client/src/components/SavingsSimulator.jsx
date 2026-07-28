import React, { useState } from 'react';
import { Sliders, Sparkles, TrendingDown, DollarSign, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function SavingsSimulator({ monthlySpend = 3120 }) {
  const [savingsPlanPct, setSavingsPlanPct] = useState(40);
  const [armMigratePct, setArmMigratePct] = useState(50);
  const [autoStopPct, setAutoStopPct] = useState(80);

  // Calculations
  const computeShare = monthlySpend * 0.55;
  const storageShare = monthlySpend * 0.25;

  const spSavings = (computeShare * (savingsPlanPct / 100)) * 0.35; // 35% discount on Savings Plans
  const armSavings = (computeShare * (armMigratePct / 100)) * 0.20; // 20% savings on Graviton
  const stopSavings = (computeShare * (autoStopPct / 100)) * 0.15; // 15% weekend shutdown savings

  const totalMonthlySavings = parseFloat((spSavings + armSavings + stopSavings).toFixed(2));
  const totalAnnualSavings = parseFloat((totalMonthlySavings * 12).toFixed(2));
  const newMonthlySpend = parseFloat((monthlySpend - totalMonthlySavings).toFixed(2));
  const reductionPercentage = parseFloat(((totalMonthlySavings / monthlySpend) * 100).toFixed(1));

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)', border: '1px solid rgba(255, 153, 0, 0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={22} color="#FF9900" />
            Interactive "What-If" Financial Savings Simulator
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Drag sliders to simulate cost reductions from Savings Plans, ARM Graviton3 migrations, and Auto-Shutdown rules
          </p>
        </div>

        <span className="badge badge-live">
          REAL-TIME FINOPS SIMULATOR
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Sliders Control Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Slider 1: Savings Plans */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ color: '#FFF' }}>3-Year Savings Plan Commitment</span>
              <span style={{ color: '#FF9900' }}>{savingsPlanPct}% of Compute</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={savingsPlanPct}
              onChange={(e) => setSavingsPlanPct(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#FF9900', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Estimated 35% discount on committed compute instances
            </div>
          </div>

          {/* Slider 2: ARM Migration */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ color: '#FFF' }}>x86 to ARM Graviton3 Migration</span>
              <span style={{ color: '#38BDF8' }}>{armMigratePct}% of Workloads</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={armMigratePct}
              onChange={(e) => setArmMigratePct(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#38BDF8', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              20% lower cost + 60% energy efficiency gain
            </div>
          </div>

          {/* Slider 3: Auto Shutdown */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ color: '#FFF' }}>Weekend Environment Auto-Shutdown</span>
              <span style={{ color: '#34D399' }}>{autoStopPct}% Staging VMs</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={autoStopPct}
              onChange={(e) => setAutoStopPct(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#34D399', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Automated stop for non-prod clusters on weekends
            </div>
          </div>

        </div>

        {/* Results Card */}
        <div style={{ background: 'rgba(10, 13, 20, 0.7)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Projected Monthly Savings</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34D399', lineHeight: 1 }}>
              ${totalMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}> / month</span>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Annual Cost Cut</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                  ${totalAnnualSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>New Monthly Spend</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FF9900' }}>
                  ${newMonthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#34D399', fontWeight: 700 }}>Total Reduction: -{reductionPercentage}%</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Based on simulated parameters</span>
          </div>
        </div>

      </div>
    </div>
  );
}
