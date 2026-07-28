import React, { useState } from 'react';
import { Sliders, Key, Shield, Globe, Sparkles, Save, X, CheckCircle2, Zap } from 'lucide-react';

export default function SettingsModal({ user, onClose, onSaveSettings }) {
  const [activeTab, setActiveTab] = useState('aws');
  const [fullName, setFullName] = useState(user?.fullName || '');
  
  // AWS Credentials
  const [awsAccessKey, setAwsAccessKey] = useState(user?.awsAccessKey || '');
  const [awsSecretKey, setAwsSecretKey] = useState(user?.awsSecretKey || '');
  const [awsRegion, setAwsRegion] = useState(user?.awsRegion || 'us-east-1');
  
  // Azure Credentials
  const [azureClientId, setAzureClientId] = useState(user?.azureClientId || '');
  const [azureTenantId, setAzureTenantId] = useState('');
  const [azureSecret, setAzureSecret] = useState('');

  // GCP Credentials
  const [gcpProjectId, setGcpProjectId] = useState(user?.gcpProjectId || '');
  const [gcpServiceKey, setGcpServiceKey] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const cleanAwsAccessKey = awsAccessKey.trim();
      const cleanAwsSecretKey = awsSecretKey.trim();
      const cleanAzureClientId = azureClientId.trim();
      const cleanGcpProjectId = gcpProjectId.trim();

      await onSaveSettings({
        fullName: fullName.trim(),
        awsAccessKey: cleanAwsAccessKey,
        awsSecretKey: cleanAwsSecretKey,
        awsRegion,
        azureClientId: cleanAzureClientId,
        azureTenantId: azureTenantId.trim(),
        azureSecret: azureSecret.trim(),
        gcpProjectId: cleanGcpProjectId,
        gcpServiceKey: gcpServiceKey.trim(),
        demoMode: false // Always switch off demo mode when user saves credentials
      });

      setSuccessMsg('⚡ Credentials saved! Calculating live cost metrics...');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '580px', width: '100%', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF9900 0%, #0089D6 50%, #4285F4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF'
          }}>
            <Sliders size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Cloud API Credentials Setup</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter your AWS, Azure, or GCP credentials to calculate live cost metrics</p>
          </div>
        </div>

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34D399',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Platform Selection Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('aws')}
            style={{
              background: activeTab === 'aws' ? 'rgba(255,153,0,0.2)' : 'transparent',
              color: activeTab === 'aws' ? '#FF9900' : 'var(--text-muted)',
              border: activeTab === 'aws' ? '1px solid #FF9900' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🟧 AWS Credentials
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('azure')}
            style={{
              background: activeTab === 'azure' ? 'rgba(0,137,214,0.2)' : 'transparent',
              color: activeTab === 'azure' ? '#38BDF8' : 'var(--text-muted)',
              border: activeTab === 'azure' ? '1px solid #0089D6' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🟦 Azure Credentials
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gcp')}
            style={{
              background: activeTab === 'gcp' ? 'rgba(66,133,244,0.2)' : 'transparent',
              color: activeTab === 'gcp' ? '#60A5FA' : 'var(--text-muted)',
              border: activeTab === 'gcp' ? '1px solid #4285F4' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🟩 GCP Credentials
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* TAB 1: AWS Credentials */}
          {activeTab === 'aws' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  AWS Access Key ID
                </label>
                <div style={{ position: 'relative' }}>
                  <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="e.g. AKIAIOSFODNN7EXAMPLE"
                    value={awsAccessKey}
                    onChange={(e) => setAwsAccessKey(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 10px 10px 36px', color: '#FFF', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  AWS Secret Access Key
                </label>
                <div style={{ position: 'relative' }}>
                  <Shield size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="e.g. wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                    value={awsSecretKey}
                    onChange={(e) => setAwsSecretKey(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 10px 10px 36px', color: '#FFF', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  AWS Region
                </label>
                <select
                  value={awsRegion}
                  onChange={(e) => setAwsRegion(e.target.value)}
                  style={{ width: '100%', background: 'rgba(10,13,20,0.9)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontSize: '0.9rem' }}
                >
                  <option value="us-east-1">US East (N. Virginia) [us-east-1]</option>
                  <option value="us-west-2">US West (Oregon) [us-west-2]</option>
                  <option value="eu-west-1">Europe (Ireland) [eu-west-1]</option>
                  <option value="ap-south-1">Asia Pacific (Mumbai) [ap-south-1]</option>
                </select>
              </div>
            </>
          )}

          {/* TAB 2: Azure Credentials */}
          {activeTab === 'azure' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Azure Client (Application) ID
                </label>
                <input
                  type="text"
                  placeholder="00000000-0000-0000-0000-000000000000"
                  value={azureClientId}
                  onChange={(e) => setAzureClientId(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Azure Directory (Tenant) ID
                </label>
                <input
                  type="text"
                  placeholder="11111111-1111-1111-1111-111111111111"
                  value={azureTenantId}
                  onChange={(e) => setAzureTenantId(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Azure Client Secret Value
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••"
                  value={azureSecret}
                  onChange={(e) => setAzureSecret(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                />
              </div>
            </>
          )}

          {/* TAB 3: GCP Credentials */}
          {activeTab === 'gcp' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  GCP Project ID
                </label>
                <input
                  type="text"
                  placeholder="my-gcp-cloud-project-12345"
                  value={gcpProjectId}
                  onChange={(e) => setGcpProjectId(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  GCP Service Account JSON Key
                </label>
                <textarea
                  rows="3"
                  placeholder='{"type": "service_account", "project_id": "..."}'
                  value={gcpServiceKey}
                  onChange={(e) => setGcpServiceKey(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#FFF', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1 }}>
              <Zap size={16} />
              {saving ? 'Calculating...' : 'Save & Calculate Live Costs'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
