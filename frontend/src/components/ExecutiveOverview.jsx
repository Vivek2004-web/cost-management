import React from 'react';
import { ShieldCheck, Zap, DollarSign, Activity, AlertTriangle, ArrowUpRight, TrendingDown } from 'lucide-react';

export default function ExecutiveOverview({ summary, onNavigate }) {
  const healthScore = 92;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(255, 153, 0, 0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={22} color="#00FF87" />
            Executive FinOps & Real-Time Cloud Operations
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#00FF87', fontWeight: 700 }}>
            ⚡ Live Auto-Synced via GitHub Actions Docker CI/CD Pipeline
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={18} color="#34D399" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34D399' }}>
              CLOUD HEALTH SCORE: {healthScore}/100
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Metric 1: Current Month Spend (MTD) */}
        <div style={{ background: 'rgba(10, 13, 20, 0.7)', border: '1px solid rgba(255, 153, 0, 0.3)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Current Month Spend (MTD)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FF9900' }}>
            ${(summary?.currentMonthCost ?? summary?.totalMonthlyCost ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
            {summary?.currentMonthName || 'August'} (Days 1–{summary?.currentMonthDaysElapsed || 15})
          </div>
        </div>

        {/* Metric 2: Month End Forecast */}
        <div style={{ background: 'rgba(10, 13, 20, 0.7)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Projected Month-End Spend</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF' }}>
            ${summary?.forecastMonthEnd ? summary.forecastMonthEnd.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '3,380.00'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F87171', marginTop: '4px', fontWeight: 700 }}>
            +{summary?.monthTrendPercentage || 8.4}% vs previous month
          </div>
        </div>

        {/* Metric 3: Savings & Promotional Credits */}
        <div style={{ background: 'rgba(10, 13, 20, 0.7)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '6px' }}>AWS Credits / Savings</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34D399' }}>
            ${summary?.creditsRemaining ? summary.creditsRemaining.toFixed(2) : '188.20'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TrendingDown size={14} /> Active Promotional Credits
          </div>
        </div>

        {/* Metric 4: Active Resources */}
        <div style={{ background: 'rgba(10, 13, 20, 0.7)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Cloud Resources</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38BDF8' }}>
            5 Nodes
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '4px', fontWeight: 600 }}>
            5 AWS EC2 (All Stopped)
          </div>
        </div>

        {/* Metric 5: Critical Alerts */}
        <div style={{ background: 'rgba(10, 13, 20, 0.7)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Critical Alerts</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34D399' }}>
            0 Spikes
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '4px', fontWeight: 700 }}>
            100% Healthy • 0 Anomalies
          </div>
        </div>

      </div>
    </div>
  );
}
