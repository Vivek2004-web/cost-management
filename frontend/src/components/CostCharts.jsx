import React, { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Filter, LineChart as LineIcon, BarChart3, Eye, EyeOff } from 'lucide-react';

export default function CostCharts({ dailyBreakdown, serviceDistribution, dailyServiceBreakdown, period, onPeriodChange }) {
  const [serviceViewMode, setServiceViewMode] = useState('pie'); // 'pie' | 'trend' | 'bar'
  const [hiddenServices, setHiddenServices] = useState({});

  const safeServices = (serviceDistribution || []).map(s => ({
    ...s,
    amount: s.amount || s.cost || 0,
    percentage: s.percentage || 10
  }));

  const trendData = (dailyServiceBreakdown && dailyServiceBreakdown.length > 0)
    ? dailyServiceBreakdown
    : (dailyBreakdown || []).map(day => {
        const item = { ...day };
        safeServices.forEach(srv => {
          item[srv.name] = parseFloat(((srv.amount / (dailyBreakdown.reduce((a,b)=>a+b.total,1)||1)) * day.total).toFixed(2));
        });
        return item;
      });

  const toggleServiceVisibility = (serviceName) => {
    setHiddenServices(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  };

  const CustomDailyTooltip = ({ active, payload, label }) => {
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
            Total Spend: ${payload[0]?.value ? payload[0].value.toFixed(2) : '0.00'}
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

  const CustomServiceTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(10, 13, 20, 0.95)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          fontSize: '0.82rem',
          maxWidth: '280px'
        }}>
          <p style={{ fontWeight: 700, marginBottom: '8px', color: '#FFF', borderBottom: '1px solid var(--border-color)', pb: '4px' }}>
            📅 {label}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {payload.map((entry, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: entry.color, fontWeight: 600 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
                  {entry.name}:
                </span>
                <strong style={{ color: '#FFF' }}>${Number(entry.value || 0).toFixed(2)}</strong>
              </div>
            ))}
          </div>
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
            {[{ id: 'MTD', label: 'MTD (This Month)' }, { id: '7', label: '7 Days' }, { id: '30', label: '30 Days' }, { id: '90', label: '90 Days' }].map((item) => (
              <button
                key={item.id}
                onClick={() => onPeriodChange(item.id)}
                style={{
                  background: period === item.id ? 'var(--aws-orange)' : 'rgba(255, 255, 255, 0.05)',
                  color: period === item.id ? '#0A0D14' : 'var(--text-main)',
                  fontWeight: 700,
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.label}
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
              <Tooltip content={<CustomDailyTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#FF9900" strokeWidth={3} fillOpacity={1} fill="url(#costGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🍰 Service-Wise Spending & Historical Trend Explorer */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieIcon size={20} color="#3B82F6" />
                Service Spending
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {serviceViewMode === 'pie' && 'Snapshot cost allocation by cloud product'}
                {serviceViewMode === 'trend' && 'Historical daily cost trends per service'}
                {serviceViewMode === 'bar' && 'Service spend comparison'}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '3px', border: '1px solid var(--border-color)' }}>
              <button
                title="Donut Allocation"
                onClick={() => setServiceViewMode('pie')}
                style={{
                  background: serviceViewMode === 'pie' ? '#3B82F6' : 'transparent',
                  color: serviceViewMode === 'pie' ? '#FFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                <PieIcon size={14} /> Allocation
              </button>

              <button
                title="Historical Trends over Time"
                onClick={() => setServiceViewMode('trend')}
                style={{
                  background: serviceViewMode === 'trend' ? '#3B82F6' : 'transparent',
                  color: serviceViewMode === 'trend' ? '#FFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                <LineIcon size={14} /> Trends
              </button>

              <button
                title="Bar Comparison"
                onClick={() => setServiceViewMode('bar')}
                style={{
                  background: serviceViewMode === 'bar' ? '#3B82F6' : 'transparent',
                  color: serviceViewMode === 'bar' ? '#FFF' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                <BarChart3 size={14} /> Compare
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Display based on serviceViewMode */}
        <div style={{ height: '210px', width: '100%', position: 'relative', margin: '8px 0' }}>
          <ResponsiveContainer width="100%" height="100%">
            {serviceViewMode === 'pie' ? (
              <PieChart>
                <Pie
                  data={safeServices}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="amount"
                >
                  {safeServices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} stroke="rgba(0,0,0,0.5)" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value || 0).toFixed(2)}`, 'Cost']} />
              </PieChart>
            ) : serviceViewMode === 'trend' ? (
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="displayDate" stroke="var(--text-dim)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomServiceTrendTooltip />} />
                {safeServices.map((srv) => (
                  !hiddenServices[srv.name] && (
                    <Line
                      key={srv.name}
                      type="monotone"
                      dataKey={srv.name}
                      name={srv.name}
                      stroke={srv.color || '#3B82F6'}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  )
                ))}
              </LineChart>
            ) : (
              <BarChart data={safeServices} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis type="number" stroke="var(--text-dim)" fontSize={10} tickFormatter={(val) => `$${val}`} />
                <YAxis dataKey="name" type="category" stroke="var(--text-dim)" fontSize={9} width={90} tickLine={false} />
                <Tooltip formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Spend']} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {safeServices.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color || '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend & Interactive Service Toggles List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
          {safeServices.map((srv) => {
            const isHidden = !!hiddenServices[srv.name];
            return (
              <div
                key={srv.name}
                onClick={() => serviceViewMode === 'trend' && toggleServiceVisibility(srv.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  fontSize: '0.75rem',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  background: isHidden ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                  opacity: isHidden ? 0.4 : 1,
                  cursor: serviceViewMode === 'trend' ? 'pointer' : 'default',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: srv.color || '#3B82F6' }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: 500, maxWidth: '125px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {srv.name}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                    ${srv.amount ? srv.amount.toLocaleString() : '0'} ({srv.percentage}%)
                  </span>
                  {serviceViewMode === 'trend' && (
                    <span style={{ color: isHidden ? '#EF4444' : '#10B981', display: 'flex' }}>
                      {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
