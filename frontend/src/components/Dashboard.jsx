import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import KpiCards from './KpiCards';
import CostCharts from './CostCharts';
import BudgetTracker from './BudgetTracker';
import AiCostAdvisor from './AiCostAdvisor';
import ResourceInventory from './ResourceInventory';
import AnomalyRadar from './AnomalyRadar';
import MultiCloudBreakdown from './MultiCloudBreakdown';
import SettingsModal from './SettingsModal';
import EmailAlertModal from './EmailAlertModal';
import QuickActionsModal from './QuickActionsModal';
import { AlertTriangle, Key, ArrowRight } from 'lucide-react';

export default function Dashboard({ user, token, onLogout, onUpdateUser }) {
  const [costData, setCostData] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [period, setPeriod] = useState('30');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('overview');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const fetchData = async (selectedPeriod = period, forceRefresh = false) => {
    setRefreshing(true);
    try {
      const url = `/api/costs/overview?period=${selectedPeriod}${forceRefresh ? '&refresh=true' : ''}`;
      const costRes = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const costJson = await costRes.json();
      setCostData(costJson);

      const budgetRes = await fetch('/api/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const budgetJson = await budgetRes.json();
      if (budgetJson.success) {
        setBudgets(budgetJson.budgets);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchData(newPeriod);
  };

  const handleAddBudget = async (newBudget) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newBudget)
      });
      const data = await res.json();
      if (data.success) fetchData(period);
    } catch (err) {
      console.error('Add budget error:', err);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      const res = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setBudgets(prev => prev.filter(b => b.id !== budgetId));
    } catch (err) {
      console.error('Delete budget error:', err);
    }
  };

  const handleSaveSettings = async (settings) => {
    const res = await fetch('/api/auth/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (data.success) {
      onUpdateUser(data.user);
      fetchData(period);
    }
  };

  const handleToggleDemoMode = () => {
    const nextMode = !(costData?.isDemoMode ?? user?.demoMode === 1);
    handleSaveSettings({ demoMode: nextMode });
  };

  const handleSelectModule = (modId) => {
    if (modId === 'COMMAND_PALETTE_OPEN') { setShowCommandPalette(true); return; }
    if (modId === 'settings') { setShowSettings(true); return; }
    if (modId === 'quick' || modId === 'reports') { setShowQuickActions(true); return; }
    setActiveModule(modId);
  };

  // Show a section if it matches the active module OR if 'overview' is active (shows all)
  const show = (mod) => activeModule === 'overview' || activeModule === mod;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#07090E' }}>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
      />

      <div style={{ flex: 1, minWidth: 0, paddingBottom: '60px' }}>

        <Navbar
          user={user}
          isDemoMode={costData?.isDemoMode ?? user?.demoMode === 1}
          credentialNotice={costData?.credentialNotice}
          onOpenSettings={() => setShowSettings(true)}
          onOpenEmailAlerts={() => setShowEmailModal(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          onOpenQuickActions={() => setShowQuickActions(true)}
          onToggleDemoMode={handleToggleDemoMode}
          onLogout={onLogout}
          onRefresh={() => fetchData(period, true)}
          isRefreshing={refreshing}
        />

        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <div className="spin-anim" style={{ fontSize: '2rem', marginBottom: '16px' }}>☁️</div>
              <p>Loading cloud cost data...</p>
            </div>
          ) : (
            <div className="animate-fade-in">

              {/* AWS API Error Banner */}
              {costData?.awsError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle size={22} color="#EF4444" />
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F87171' }}>
                        AWS Cost Explorer API Connection Issue
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#FCA5A5', marginTop: '2px' }}>
                        {costData.awsError}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="btn-primary"
                    style={{ padding: '8px 14px', fontSize: '0.8rem', background: '#EF4444' }}
                  >
                    <Key size={14} /> Update AWS API Keys <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* ── KPI Summary Cards (always visible) ── */}
              <KpiCards
                summary={costData?.summary}
                budgets={budgets}
              />

              {/* ── Multi-Cloud Provider Breakdown (overview & charts) ── */}
              {(show('charts') || show('overview')) && costData?.cloudProviders?.length > 1 && (
                <MultiCloudBreakdown cloudProviders={costData?.cloudProviders} />
              )}

              {/* ── Cost Charts (overview & charts) ── */}
              {show('charts') && (
                <CostCharts
                  dailyBreakdown={costData?.dailyBreakdown}
                  serviceDistribution={costData?.serviceDistribution}
                  dailyServiceBreakdown={costData?.dailyServiceBreakdown}
                  period={period}
                  onPeriodChange={handlePeriodChange}
                />
              )}

              {/* ── Budget Tracker ── */}
              {show('budgets') && (
                <BudgetTracker
                  budgets={budgets}
                  onAddBudget={handleAddBudget}
                  onDeleteBudget={handleDeleteBudget}
                />
              )}

              {/* ── AI Cost Advisor ── */}
              {show('advisor') && (
                <AiCostAdvisor aiCostAdvisor={costData?.aiCostAdvisor} />
              )}

              {/* ── Resource Inventory ── */}
              {show('inventory') && (
                <ResourceInventory token={token} />
              )}

              {/* ── Anomaly Radar ── */}
              {show('anomalies') && (
                <AnomalyRadar token={token} isDemoMode={costData?.isDemoMode ?? user?.demoMode === 1} />
              )}

            </div>
          )}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectModule={handleSelectModule}
        onRunQuickAction={(action) => {
          if (action === 'REFRESH') fetchData(period);
          else setShowQuickActions(true);
        }}
      />

      <QuickActionsModal
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onRefreshData={() => fetchData(period)}
      />

      {showSettings && (
        <SettingsModal
          user={user}
          onClose={() => setShowSettings(false)}
          onSaveSettings={handleSaveSettings}
        />
      )}

      {showEmailModal && (
        <EmailAlertModal
          token={token}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}
