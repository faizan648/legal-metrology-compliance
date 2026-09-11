import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  FileText, 
  Printer, 
  Scale, 
  Gavel, 
  ArrowLeft,
  Share2,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import jsPDF from 'jspdf';

export default function ComplianceReport({ reportData, onBackToScan, onSaveToRepository }) {
  const [noticeIssued, setNoticeIssued] = useState(false);
  const [order100PercentCheck, setOrder100PercentCheck] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!reportData || !reportData.audit) return null;

  const { product, audit, svgLabel, imageUrl } = reportData;
  const productName = product.name || product.genericName || 'Unknown Product';
  const productCategory = product.category || 'General Packaged Commodity';
  const { complianceScore, status, violations, warnings, ruleResults, mpeInfo, requiredFont } = audit;

  // Status Styling
  const isCompliant = status === 'COMPLIANT';
  const isPartial = status === 'PARTIALLY_COMPLIANT';

  // Export PDF Report Generator
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('LEGAL METROLOGY COMPLIANCE INSPECTION REPORT', 15, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Under Legal Metrology (Packaged Commodities) Rules, 2011', 15, 26);
    doc.text(`Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}`, 15, 33);

    // Product Info Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Product & Inspection Details', 15, 52);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Product Name: ${productName}`, 15, 60);
    doc.text(`Category: ${productCategory}`, 15, 67);
    doc.text(`Manufacturer: ${product.manufacturerName || 'N/A'}`, 15, 74);
    doc.text(`Address: ${product.manufacturerAddress || 'N/A'}`, 15, 81);
    doc.text(`Net Quantity: ${product.netQuantityValue} ${product.netQuantityUnit}`, 15, 88);
    doc.text(`Declared MRP: Rs. ${product.mrpValue}`, 15, 95);

    // Scorecard Box
    doc.setFillColor(isCompliant ? 240 : 254, isCompliant ? 253 : 242, isCompliant ? 244 : 242);
    doc.rect(130, 52, 65, 45, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Score: ${complianceScore}/100`, 135, 65);
    doc.text(`Status: ${status}`, 135, 75);

    // Violations Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Legal Rule Violations & Contraventions', 15, 110);

    let yPos = 120;
    if (violations.length === 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('No rule violations detected. Product complies with Legal Metrology Rules, 2011.', 15, yPos);
    } else {
      violations.forEach((v, idx) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(220, 38, 38);
        doc.text(`${idx + 1}. [${v.rule}] ${v.title}`, 15, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text(`Details: ${v.description}`, 20, yPos + 6);
        doc.text(`Penalty Reference: ${v.penalty}`, 20, yPos + 12);
        yPos += 20;
      });
    }

    // Signature Block
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Enforcement Officer Signature: ______________________', 15, 270);
    doc.text('Stamp & Date: ______________________', 120, 270);

    doc.save(`Legal_Metrology_Report_${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

  // Export JSON/CSV
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Legal_Metrology_Audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Save Record to Repository
  const handleSave = () => {
    onSaveToRepository(reportData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4">
        <button
          onClick={onBackToScan}
          className="btn-secondary text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Scanner
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleSave} className="btn-secondary text-xs">
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <FileSpreadsheet className="w-4 h-4 text-cyan-400" />}
            {saveSuccess ? 'Saved to Repository!' : 'Save to Inspection Database'}
          </button>
          <button onClick={handleExportPDF} className="btn-primary text-xs">
            <Download className="w-4 h-4 text-cyan-300" /> Download PDF Report
          </button>
          <button onClick={handleExportJSON} className="btn-secondary text-xs">
            <FileText className="w-4 h-4" /> Export JSON
          </button>
          <button onClick={() => window.print()} className="btn-secondary text-xs">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Header Banner & Scorecard */}
      <div className={`glass-card p-6 border-l-8 ${
        isCompliant ? 'border-emerald-500 bg-emerald-950/20' : isPartial ? 'border-amber-500 bg-amber-950/20' : 'border-red-500 bg-red-950/20'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {isCompliant ? (
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </span>
              ) : (
                <span className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                  <AlertOctagon className="w-8 h-8" />
                </span>
              )}
              <div>
                <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md uppercase tracking-wider ${
                  isCompliant ? 'badge-compliant' : isPartial ? 'badge-warning' : 'badge-noncompliant'
                }`}>
                  {status}
                </span>
                <h1 className="text-2xl font-bold font-heading text-slate-100 mt-1">{productName}</h1>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Scanned Packaging Inspection under Legal Metrology (Packaged Commodities) Rules, 2011
            </p>
          </div>

          {/* Score Circle & Metrics */}
          <div className="flex items-center gap-6 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-center">
              <span className="text-3xl font-extrabold font-heading text-slate-100">{complianceScore}</span>
              <span className="text-xs text-slate-500 block">/ 100 Score</span>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div className="space-y-1 text-xs">
              <div className="text-slate-400">Violations: <span className="font-bold text-red-400">{violations.length}</span></div>
              <div className="text-slate-400">Warnings: <span className="font-bold text-amber-400">{warnings.length}</span></div>
              <div className="text-slate-400">MPE Limit: <span className="font-bold text-cyan-300">±{mpeInfo.text}</span></div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Section: Violations & Rule Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Violations List & Enforcement Action (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Rule Violations Section */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Legal Rule Violations &amp; Penalty Reference
            </h3>

            {violations.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>No legal violations detected. This package fully complies with all provisions of the Legal Metrology Rules, 2011.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {violations.map((v, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        {v.rule}
                      </span>
                      <span className="text-[10px] font-mono text-red-400 uppercase font-semibold">
                        {v.severity} SEVERITY
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{v.title}</h4>
                    <p className="text-xs text-slate-300">{v.description}</p>
                    <div className="pt-2 border-t border-red-900/50 flex items-center justify-between text-[11px] text-red-400 font-mono">
                      <span>Penalty Citation:</span>
                      <span className="font-semibold text-slate-200">{v.penalty}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Officer Action Workflow (Rules 19, 20, 21) */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-amber-400" />
              Enforcement Officer Action Workflow
            </h3>
            <p className="text-xs text-slate-400">
              Empowered actions under Legal Metrology Act, 2009 &amp; Rules 19, 20, 21.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setNoticeIssued(!noticeIssued)}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition ${
                  noticeIssued ? 'bg-amber-950/40 border-amber-500 text-amber-300' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Issue Show-Cause Notice</div>
                  <div className="text-[10px] text-slate-400">Under Rule 20 / 21 for manufacturer explanation within 14 days</div>
                </div>
              </button>

              <button
                onClick={() => setOrder100PercentCheck(!order100PercentCheck)}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition ${
                  order100PercentCheck ? 'bg-red-950/40 border-red-500 text-red-300' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Scale className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Order 100% Stock Check</div>
                  <div className="text-[10px] text-slate-400">Under Rule 19(5) cent-per-cent verification at factory/depot</div>
                </div>
              </button>
            </div>

            {noticeIssued && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                <span className="font-bold block mb-1">Show-Cause Notice Generated (Form VII):</span>
                Notice served to {product.manufacturerName || 'Manufacturer'}. Required to rectify labeling and report to Controller of Legal Metrology.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Full Rule Checklist Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-base font-bold font-heading text-slate-100 flex items-center justify-between">
              <span>Rule-by-Rule Audit Matrix</span>
              <span className="text-xs font-mono text-cyan-400">{ruleResults.filter(r => r.passed).length}/{ruleResults.length} Passed</span>
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {ruleResults.map((res, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border transition ${
                    res.passed ? 'bg-slate-900/60 border-slate-800/80' : 'bg-red-950/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-slate-300">{res.rule}</span>
                    {res.passed ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        <Check className="w-3 h-3" /> PASS
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                        <X className="w-3 h-3" /> FAIL
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-200">{res.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{res.details}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
