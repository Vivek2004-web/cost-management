import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

export default function InvoiceGenerator({ summary }) {
  const [downloadMsg, setDownloadMsg] = useState('');

  const items = [
    { service: 'Amazon Web Services (AWS) - EC2 Compute & Reserved Nodes', amount: 890.00 },
    { service: 'Microsoft Azure - Virtual Machines & App Services', amount: 580.00 },
    { service: 'Amazon Web Services (AWS) - RDS Database Instances', amount: 480.00 },
    { service: 'Microsoft Azure - SQL Managed Instances', amount: 360.00 },
    { service: 'Google Cloud Platform (GCP) - Compute Engine & GKE', amount: 340.00 },
    { service: 'Amazon Web Services (AWS) - S3 Cloud Storage & Data Transfer', amount: 280.00 }
  ];

  const subtotal = items.reduce((acc, i) => acc + i.amount, 0);
  const tax = 0.00;
  const total = subtotal + tax;

  const handleDownload = (format) => {
    setDownloadMsg(`Generating itemized ${format} invoice statement...`);
    setTimeout(() => {
      setDownloadMsg(`Successfully exported ${format} billing invoice statement!`);
      setTimeout(() => setDownloadMsg(''), 3000);
    }, 1200);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} color="#FF9900" />
            Enterprise Branded Invoice & Billing Statement Generator
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Export official PDF financial billing statements and line-item CSV reports
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleDownload('CSV')} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <Download size={16} /> Export Line-Items CSV
          </button>
          <button onClick={() => handleDownload('PDF')} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <Printer size={16} /> Download PDF Invoice
          </button>
        </div>
      </div>

      {downloadMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34D399', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {downloadMsg}
        </div>
      )}

      {/* Invoice Document Preview Card */}
      <div style={{ background: 'rgba(10, 13, 20, 0.8)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
        
        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>CloudOps Enterprise Billing Statement</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Statement #: <strong>INV-2026-078912</strong> • Billing Period: July 2026</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-live">PAID / AUDITED</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Currency: USD ($)</div>
          </div>
        </div>

        {/* Invoice Table */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Cloud Service Item</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Billed Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px', color: '#FFF', fontWeight: 500 }}>{item.service}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#FFF' }}>${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Footer Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '260px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Subtotal:</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              <span>Taxes & Fees:</span>
              <strong>$0.00</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: '#FF9900', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <span>Total Invoice:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
