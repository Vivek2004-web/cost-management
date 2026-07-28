import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import PlatformFilterBar from './PlatformFilterBar';
import ThemeCustomizer from './ThemeCustomizer';
import KpiCards from './KpiCards';
import ExecutiveOverview from './ExecutiveOverview';
import SavingsSimulator from './SavingsSimulator';
import TopologyMap from './TopologyMap';
import AnomalyRadar from './AnomalyRadar';
import InvoiceGenerator from './InvoiceGenerator';
import ResourceInventory from './ResourceInventory';
import AiCostAdvisor from './AiCostAdvisor';
import MultiCloudBreakdown from './MultiCloudBreakdown';
import CostCharts from './CostCharts';
import BudgetTracker from './BudgetTracker';
import AiSavingsAssistant from './AiSavingsAssistant';
import RegionAnalysis from './RegionAnalysis';
import TeamCostCenter from './TeamCostCenter';
import CarbonImpact from './CarbonImpact';
import AutomationCenter from './AutomationCenter';
import ActivityTimeline from './ActivityTimeline';
import QuickActionsModal from './QuickActionsModal';
import SettingsModal from './SettingsModal';
import EmailAlertModal from './EmailAlertModal';
import { AlertTriangle, Key, ArrowRight } from 'lucide-react';

export default function Dashboard({ user, token, onLogout, onUpdateUser }) {
  const [costData, setCostData] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [period, setPeriod] = useState('30');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('overview');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const fetchData = async (selectedPeriod = period) => {
    setRefreshing(true);
    try {
      // 1. Fetch Costs
      const costRes = await fetch(`/api/costs/overview?period=${selectedPeriod}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const costJson = await costRes.json();
      setCostData(costJson);

      // 2. Fetch Budgets
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newBudget)
      });
      const data = await res.json();
      if (data.success) {
        fetchData(period);
      }
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
      if (data.success) {
        setBudgets(prev => prev.filter(b => b.id !== budgetId));
      }
    } catch (err) {
      console.error('Delete budget error:', err);
    }
  };

  const handleSaveSettings = async (settings) => {
    const res = await fetch('/api/auth/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
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

  const getFilteredData = () => {
    if (!costData) return null;
    if (selectedPlatform === 'ALL') return costData;

    const filteredProviders = (costData.cloudProviders || []).filter(p => p.short.toUpperCase() === selectedPlatform || p.name.toUpperCase().includes(selectedPlatform));
    const filteredServices = (costData.serviceDistribution || []).filter(s => !s.provider || s.provider.toUpperCase().includes(selectedPlatform) || selectedPlatform === 'AWS');
    const filteredAiAdvisor = (costData.aiCostAdvisor || []).filter(r => !r.provider || r.provider.toUpperCase().includes(selectedPlatform));
    const filteredAiRecs = (costData.aiRecommendations || []).filter(r => !r.provider || r.provider.toUpperCase().includes(selectedPlatform));

    // Calculate actual total cost for selected platform directly from real backend data
    const platformTotal = filteredProviders.length > 0 ? filteredProviders.reduce((acc, p) => acc + p.cost, 0) : costData.summary?.totalMonthlyCost;

    return {
      ...costData,
      summary: {
        ...costData.summary,
        totalMonthlyCost: parseFloat(platformTotal.toFixed(2)),
        todaysCost: parseFloat(((platformTotal) / 28).toFixed(2)),
        highestCostService: filteredServices.length > 0 ? filteredServices[0].name : `${selectedPlatform} Services`
      },
      cloudProviders: filteredProviders.length > 0 ? filteredProviders : costData.cloudProviders,
      serviceDistribution: filteredServices.length > 0 ? filteredServices : costData.serviceDistribution,
      aiCostAdvisor: filteredAiAdvisor,
      aiRecommendations: filteredAiRecs
    };
  };

  const displayData = getFilteredData();

  const handleSelectModule = (modId) => {
    if (modId === 'COMMAND_PALETTE_OPEN') {
      setShowCommandPalette(true);
      return;
    }
    if (modId === 'settings') {
      setShowSettings(true);
      return;
    }
    if (modId === 'quick' || modId === 'reports') {
      setShowQuickActions(true);
      return;
    }
    setActiveModule(modId);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#07090E' }}>
      
      {/* Collapsible Enterprise Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
      />

      {/* Main Content Workspace */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: '60px' }}>
        
        {/* Sticky Top Navbar */}
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
          onRefresh={() => fetchData(period)}
          isRefreshing={refreshing}
        />

        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <div className="spin-anim" style={{ fontSize: '2rem', marginBottom: '16px' }}>☁️</div>
              <p>Fetching Actual AWS Cost Explorer Billing Data...</p>
            </div>
          ) : (
            <div className="animate-fade-in">

              {/* AWS API Connection Notice Banner (If Error) */}
              {displayData?.awsError && (
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
                        {displayData.awsError}
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

              {/* Theme Customizer Accent Bar */}
              <ThemeCustomizer />
              
              {/* Platform Selection Filter Bar */}
              <PlatformFilterBar
                selectedPlatform={selectedPlatform}
                onSelectPlatform={(plat) => setSelectedPlatform(plat)}
              />

              {/* Module 1: Executive Overview */}
              {(activeModule === 'overview' || activeModule === 'all') && (
                <ExecutiveOverview
                  summary={displayData?.summary}
                  onNavigate={(mod) => setActiveModule(mod)}
                />
              )}

              {/* Top KPI Summary Cards */}
              <KpiCards
                summary={displayData?.summary}
                budgets={budgets}
              />

              {/* Feature 1: Interactive Savings Simulator */}
              {(activeModule === 'overview' || activeModule === 'advisor') && (
                <SavingsSimulator monthlySpend={displayData?.summary?.totalMonthlyCost || 0} />
              )}

              {/* Feature 2: Infrastructure Topology Map */}
              {(activeModule === 'overview' || activeModule === 'inventory') && (
                <TopologyMap />
              )}

              {/* Feature 4: Live Anomaly Radar & Alert Test */}
              {(activeModule === 'overview' || activeModule === 'anomalies') && (
                <AnomalyRadar token={token} />
              )}

              {/* Feature 3: Invoice & Billing Generator */}
              {(activeModule === 'overview' || activeModule === 'reports') && (
                <InvoiceGenerator summary={displayData?.summary} />
              )}

              {/* Module 2 & 3: AI Cost Advisor */}
              {(activeModule === 'overview' || activeModule === 'advisor' || activeModule === 'anomalies') && (
                <AiCostAdvisor
                  aiCostAdvisor={displayData?.aiCostAdvisor}
                />
              )}

              {/* Module 4: Searchable Resource Inventory */}
              {(activeModule === 'overview' || activeModule === 'inventory') && (
                <ResourceInventory />
              )}

              {/* Multi-Cloud Provider Breakdown */}
              {selectedPlatform === 'ALL' && (
                <MultiCloudBreakdown
                  cloudProviders={displayData?.cloudProviders}
                />
              )}

              {/* Daily Spending & Service Distribution Charts */}
              <CostCharts
                dailyBreakdown={displayData?.dailyBreakdown}
                serviceDistribution={displayData?.serviceDistribution}
                period={period}
                onPeriodChange={handlePeriodChange}
              />

              {/* Module 8: Region Analysis */}
              {(activeModule === 'overview' || activeModule === 'regions') && (
                <RegionAnalysis />
              )}

              {/* Module 9: Team Cost Center */}
              {(activeModule === 'overview' || activeModule === 'teams') && (
                <TeamCostCenter />
              )}

              {/* Module 10: Carbon Impact */}
              {(activeModule === 'overview' || activeModule === 'carbon') && (
                <CarbonImpact />
              )}

              {/* Module 11: Automation Rules */}
              {(activeModule === 'overview' || activeModule === 'automation') && (
                <AutomationCenter />
              )}

              {/* AI Money Saving Assistant */}
              <AiSavingsAssistant
                aiRecommendations={displayData?.aiRecommendations}
              />

              {/* Budget Tracking & Alert Controls */}
              <BudgetTracker
                budgets={budgets}
                onAddBudget={handleAddBudget}
                onDeleteBudget={handleDeleteBudget}
              />

              {/* Module 12: Activity Timeline */}
              {(activeModule === 'overview' || activeModule === 'timeline') && (
                <ActivityTimeline />
              )}

            </div>
          )}
        </main>

      </div>

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectModule={handleSelectModule}
        onRunQuickAction={(action) => {
          if (action === 'REFRESH') fetchData(period);
          else setShowQuickActions(true);
        }}
      />

      {/* Quick Actions & Export Reports Modal */}
      <QuickActionsModal
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onRefreshData={() => fetchData(period)}
      />

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          user={user}
          onClose={() => setShowSettings(false)}
          onSaveSettings={handleSaveSettings}
        />
      )}

      {/* Email Alert Modal */}
      {showEmailModal && (
        <EmailAlertModal
          token={token}
          onClose={() => setShowEmailModal(false)}
        />
      )}

    </div>
  );
}
