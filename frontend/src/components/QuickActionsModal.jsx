import React, { useState } from 'react';
import { Play, FileText, Download, Share2, RefreshCw, Zap, Plus, CheckCircle2, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function QuickActionsModal({ isOpen, onClose, onRefreshData }) {
  const [notification, setNotification] = useState('');

  if (!isOpen) return null;

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(7, 9, 14);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 153, 0);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CloudOps.Enterprise FinOps Report', 14, 22);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Executive Multi-Cloud Financial Cost & Audit Summary', 14, 30);

      autoTable(doc, {
        startY: 50,
        head: [['Cloud Provider / Service', 'Category', 'Billed Amount ($)']],
        body: [
          ['Amazon Web Services (AWS) - EC2 Compute', 'Compute', '$890.00'],
          ['Microsoft Azure - Virtual Machines', 'Compute', '$580.00'],
          ['Amazon Web Services (AWS) - RDS Postgres', 'Database', '$480.00'],
          ['Microsoft Azure - SQL Database', 'Database', '$360.00'],
          ['Google Cloud Platform (GCP) - Compute Engine', 'Compute', '$340.00'],
          ['Amazon Web Services (AWS) - S3 Storage', 'Storage', '$280.00']
        ],
        theme: 'striped',
        headStyles: { fillColor: [255, 153, 0], textColor: [255, 255, 255] }
      });

      doc.save('CloudOps_Executive_FinOps_Report.pdf');
      setNotification('Downloaded PDF report: CloudOps_Executive_FinOps_Report.pdf');
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const csvContent = 'Service,Category,Amount\nAWS EC2,Compute,890.00\nAzure VMs,Compute,580.00\nAWS RDS,Database,480.00\nAzure SQL,Database,360.00\nGCP Engine,Compute,340.00\nAWS S3,Storage,280.00';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CloudOps_Raw_LineItems.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification('Downloaded CSV report: CloudOps_Raw_LineItems.csv');
    setTimeout(() => setNotification(''), 3000);
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
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '540px', width: '100%', padding: '32px', position: 'relative' }}>
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
            background: 'linear-gradient(135deg, #FF9900 0%, #E67E00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0A0D14'
          }}>
            <Play size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Enterprise Quick Actions & Reports</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Execute cloud operations, export PDF/CSV reports, and refresh data</p>
          </div>
        </div>

        {notification && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34D399',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} /> {notification}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          
          <button
            onClick={handleExportPDF}
            className="glass-card-interactive"
            style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
            <Download size={20} color="#FF9900" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>Export Original PDF Report</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Downloads PDF invoice</div>
          </button>

          <button
            onClick={handleExportCSV}
            className="glass-card-interactive"
            style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
            <FileText size={20} color="#3B82F6" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>Export Raw CSV Data</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Downloads CSV line-items</div>
          </button>

          <button
            onClick={() => { onRefreshData(); setNotification('Refreshed live cloud cost data!'); setTimeout(() => setNotification(''), 3000); }}
            className="glass-card-interactive"
            style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
            <RefreshCw size={20} color="#34D399" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>Refresh Cost Data</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sync cost metrics</div>
          </button>

          <button
            onClick={() => { setNotification('Generated AI FinOps Executive Report'); setTimeout(() => setNotification(''), 3000); }}
            className="glass-card-interactive"
            style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border-color)' }}
          >
            <Zap size={20} color="#8B5CF6" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>Generate AI Report</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI FinOps analysis</div>
          </button>

        </div>

        <button onClick={onClose} className="btn-secondary" style={{ width: '100%', padding: '10px' }}>
          Close Modal
        </button>
      </div>
    </div>
  );
}
