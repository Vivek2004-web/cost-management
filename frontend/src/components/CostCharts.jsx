import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Filter } from 'lucide-react';

export default function CostCharts({ dailyBreakdown, serviceDistribution, period, onPeriodChange }) {
  const safeServices = (serviceDistribution || []).map(s => ({
    ...s,
    amount: s.amount || s.cost || 0,
    percentage: s.percentage || 10
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(10, 13, 20, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          fontSize: '0.85rem'
        }}>
          <p style={{ fontWeight: 700, marginBottom: '6px', color: '#FFF' }}>{label}</p>
          <p style={{ color: '#FF9900', fontWeight: 800, fontSize: '1rem', marginBottom: '8px' }}>
            Total: ${payload[0]?.value ? payload[0].value.toFixed(2) : '0.00'}
          </p>
          {payload[0]?.payload && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.75rem', color: '#FF9900' }}>
                <span>AWS:</span>
                <strong>${payload[0].payload.aws ? payload[0].payload.aws.toFixed(2) : '0.00'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.75rem', color: '#38BDF8' }}>
                <span>Azure:</span>
                <strong>${payload[0].payload.azure ? payload[0].payload.azure.toFixed(2) : '0.00'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.75rem', color: '#60A5FA' }}>
                <span>GCP:</span>
                <strong>${payload[0].payload.gcp ? payload[0].payload.gcp.toFixed(2) : '0.00'}</strong>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
      
      {/* 📈 Daily Multi-Cloud Spending Trend Chart */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#FF9900" />
              Daily Multi-Cloud Spending Trend
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Historical spending breakdown across AWS, Azure, and GCP
            </p>
          </div>

          {/* Controls: Date Range Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> Range:
            </span>
            {['7', '30', '90'].map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                style={{
                  background: period === p ? 'var(--aws-orange)' : 'rgba(255, 255, 255, 0.05)',
                  color: period === p ? '#0A0D14' : 'var(--text-main)',
                  fontWeight: 700,
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {p} Days
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyBreakdown || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9900" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FF9900" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="displayDate" stroke="var(--text-dim)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#FF9900" strokeWidth={3} fillOpacity={1} fill="url(#costGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🍰 AWS Service Cost Breakdown Pie Chart */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <PieIcon size={20} color="#3B82F6" />
            Service Allocation
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Cost distribution by cloud product service
          </p>
        </div>

        <div style={{ height: '200px', width: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeServices}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="amount"
              >
                {safeServices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} stroke="rgba(0,0,0,0.5)" />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${Number(value || 0).toFixed(2)}`, 'Cost']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '130px', overflowY: 'auto', paddingRight: '4px' }}>
          {safeServices.map((srv) => (
            <div key={srv.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: srv.color || '#3B82F6' }} />
                <span style={{ color: 'var(--text-main)', fontWeight: 500, maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {srv.name}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                ${srv.amount ? srv.amount.toLocaleString() : '0'} ({srv.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
