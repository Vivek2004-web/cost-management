import React from 'react';
import { DollarSign, Calendar, Server, Target, TrendingUp } from 'lucide-react';

export default function KpiCards({ summary, budgets }) {
  const mainBudget = budgets && budgets.length > 0 ? budgets[0] : null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '20px',
      marginBottom: '28px'
    }}>
      
      {/* 📊 Card 1: Month-to-Date Cloud Cost */}
      <div className="glass-card-interactive" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Month-to-Date Cost (MTD)
          </span>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(255, 153, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF9900'
          }}>
            <DollarSign size={22} />
          </div>
        </div>

        <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px' }}>
          ${summary?.totalMonthlyCost ? summary.totalMonthlyCost.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Last Month: <strong style={{ color: '#FFF' }}>${summary?.lastMonthCost ? summary.lastMonthCost.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}</strong></span>
        </div>
      </div>

      {/* 💰 Card 2: Today's Cloud Cost */}
      <div className="glass-card-interactive" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Today's Cloud Cost
          </span>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3B82F6'
          }}>
            <Calendar size={22} />
          </div>
        </div>

        <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px' }}>
          ${summary?.todaysCost ? summary.todaysCost.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Run-rate Forecast: <strong style={{ color: 'var(--text-main)' }}>${summary?.forecastMonthEnd ? summary.forecastMonthEnd.toLocaleString() : '0.00'}</strong> by end of month
        </div>
      </div>

      {/* ☁️ Card 3: Highest-Cost AWS Service */}
      <div className="glass-card-interactive" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Highest-Cost AWS Service
          </span>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10B981'
          }}>
            <Server size={22} />
          </div>
        </div>

        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '12px' }}>
          {summary?.highestCostService || 'Amazon EC2'}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Consumes <strong style={{ color: '#FF9900' }}>${summary?.highestServiceCost ? summary.highestServiceCost.toLocaleString() : '0.00'}</strong> of monthly budget
        </div>
      </div>

      {/* 🎯 Card 4: Active Budget Status */}
      <div className="glass-card-interactive" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Active Budget Status
          </span>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8B5CF6'
          }}>
            <Target size={22} />
          </div>
        </div>

        {mainBudget ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>
                {mainBudget.usagePercentage}%
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                of ${mainBudget.monthlyLimit.toLocaleString()} limit
              </span>
            </div>

            <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, mainBudget.usagePercentage)}%`,
                background: mainBudget.usagePercentage > 100 ? '#EF4444' : (mainBudget.usagePercentage >= mainBudget.alertThreshold ? '#F59E0B' : 'linear-gradient(90deg, #10B981, #3B82F6)'),
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </>
        ) : (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', paddingTop: '8px' }}>
            No active budget set.
          </div>
        )}
      </div>

    </div>
  );
}
