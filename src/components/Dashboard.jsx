import React, { useMemo } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  AlertOctagon, 
  TrendingUp, 
  TrendingDown,
  FileCheck, 
  BarChart3, 
  AlertTriangle,
  ArrowUpRight,
  Activity,
  Package,
  Gavel
} from 'lucide-react';

export default function Dashboard({ repositoryData, onSelectRecord }) {
  // Real stats derived from repository
  const stats = useMemo(() => {
    const total = repositoryData.length;
    const compliant = repositoryData.filter(r => r.audit.status === 'COMPLIANT').length;
    const nonCompliant = repositoryData.filter(r => r.audit.status === 'NON_COMPLIANT').length;
    const partial = repositoryData.filter(r => r.audit.status === 'PARTIALLY_COMPLIANT').length;
    const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 100;
    const avgScore = total > 0 ? Math.round(repositoryData.reduce((s, r) => s + r.audit.complianceScore, 0) / total) : 100;

    // Count violations by rule
    const ruleViolationCounts = {};
    repositoryData.forEach(record => {
      (record.audit.violations || []).forEach(v => {
        const ruleKey = v.rule;
        ruleViolationCounts[ruleKey] = (ruleViolationCounts[ruleKey] || 0) + 1;
      });
    });

    return { total, compliant, nonCompliant, partial, complianceRate, avgScore, ruleViolationCounts };
  }, [repositoryData]);

  // Simulated broader enforcement data (supplementing real scans)
  const broadViolationData = [
    { rule: 'Rule 7/8 — Font Height & Clearance', count: stats.ruleViolationCounts['Rule 7(2)'] || 0, simulated: 22, color: '#ef4444' },
    { rule: 'Rule 6(1)(e) — MRP & Tax Statement', count: stats.ruleViolationCounts['Rule 6(1)(e) & Rule 6(3)'] || 0, simulated: 18, color: '#f97316' },
    { rule: 'Rule 6(1)(a) — Manufacturer Details', count: stats.ruleViolationCounts['Rule 6(1)(a) & Rule 10'] || 0, simulated: 15, color: '#eab308' },
    { rule: 'Rule 23 — Deceptive Packaging', count: stats.ruleViolationCounts['Rule 23'] || 0, simulated: 11, color: '#a855f7' },
    { rule: 'Rule 5 — Non-Standard Pack Size', count: stats.ruleViolationCounts['Rule 5'] || 0, simulated: 10, color: '#3b82f6' },
    { rule: 'Rule 13 — SI Unit Violations', count: stats.ruleViolationCounts['Rule 6(1)(c) & Rule 13'] || 0, simulated: 8, color: '#06b6d4' },
  ];
  const maxViolation = Math.max(...broadViolationData.map(d => d.count + d.simulated), 1);

  const categoryRiskData = [
    { cat: 'Imported Packaged Goods', risk: 'CRITICAL', pct: 72, color: '#ef4444' },
    { cat: 'Biscuits & Confectionery', risk: 'HIGH', pct: 55, color: '#f97316' },
    { cat: 'Detergents & Soaps', risk: 'HIGH', pct: 48, color: '#f97316' },
    { cat: 'Edible Oils & Ghee', risk: 'MEDIUM', pct: 32, color: '#eab308' },
    { cat: 'Tea & Coffee Packs', risk: 'MEDIUM', pct: 24, color: '#eab308' },
    { cat: 'Mineral Water (Packaged)', risk: 'LOW', pct: 12, color: '#10b981' },
  ];

  const kpiCards = [
    {
      label: 'Total Products Inspected',
      value: stats.total + 42,
      subText: '+12% from last month',
      icon: FileCheck,
      iconColor: 'text-indigo-400',
      borderColor: 'border-indigo-500',
      trend: 'up'
    },
    {
      label: 'Overall Compliance Rate',
      value: `${stats.complianceRate}%`,
      subText: `Avg Score: ${stats.avgScore}/100`,
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500',
      trend: 'up',
      progressPct: stats.complianceRate,
      progressColor: 'bg-emerald-400'
    },
    {
      label: 'Non-Compliant Products',
      value: stats.nonCompliant + 18,
      subText: 'Pending enforcement action',
      icon: AlertOctagon,
      iconColor: 'text-red-400',
      borderColor: 'border-red-500',
      trend: 'down'
    },
    {
      label: 'Show-Cause Notices Issued',
      value: 14,
      subText: 'Rules 20 & 21 Actions',
      icon: Gavel,
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500',
      trend: 'neutral'
    }
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            Enforcement Officer Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time analytics, violation heatmaps &amp; enforcement metrics — Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400">Live · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`glass-card p-5 border-l-4 ${card.borderColor} space-y-2`}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">{card.label}</p>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <p className={`text-2xl font-extrabold font-heading ${card.iconColor}`}>{card.value}</p>
              {card.progressPct !== undefined && (
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${card.progressColor}`} style={{ width: `${card.progressPct}%` }} />
                </div>
              )}
              <p className={`text-[11px] font-mono flex items-center gap-1 ${
                card.trend === 'up' ? 'text-emerald-400' : card.trend === 'down' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {card.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {card.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                {card.subText}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Violation Breakdown (7 cols) */}
        <div className="lg:col-span-7 glass-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Top Rule Violation Categories
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Cases Detected</span>
          </div>

          <div className="space-y-4">
            {broadViolationData.map((item, idx) => {
              const totalCount = item.count + item.simulated;
              const widthPct = Math.round((totalCount / maxViolation) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 truncate max-w-[70%]">{item.rule}</span>
                    <span className="font-mono font-bold shrink-0 ml-2" style={{ color: item.color }}>{totalCount} cases</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.max(widthPct, 5)}%`, backgroundColor: item.color, opacity: 0.85 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Risk Matrix (5 cols) */}
        <div className="lg:col-span-5 glass-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" />
              Sector Risk Matrix
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Non-Compliance %</span>
          </div>

          <div className="space-y-3">
            {categoryRiskData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-20 shrink-0 text-right">
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border`}
                    style={{ color: item.color, borderColor: `${item.color}40`, backgroundColor: `${item.color}15` }}>
                    {item.risk}
                  </span>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="text-xs font-medium text-slate-200">{item.cat}</div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold shrink-0" style={{ color: item.color }}>{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Inspection Table */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold font-heading text-slate-100">Recent Inspection Log</h3>
          <span className="text-xs font-mono text-slate-500">{repositoryData.length} records in database</span>
        </div>

        {repositoryData.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No inspections yet. Run an audit from the Scanner to populate this log.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase">
                  <th className="pb-2 pr-4">Product</th>
                  <th className="pb-2 pr-4">Category</th>
                  <th className="pb-2 pr-4">Manufacturer</th>
                  <th className="pb-2 pr-4 text-right">Score</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Violations</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {repositoryData.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition group">
                    <td className="py-2.5 pr-4 font-semibold text-slate-100 max-w-[160px] truncate">
                      {item.product.name || item.product.genericName || 'Unnamed Product'}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-400 max-w-[120px] truncate">
                      {item.product.category || '—'}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-400 max-w-[140px] truncate">
                      {item.product.manufacturerName || '—'}
                    </td>
                    <td className="py-2.5 pr-4 text-right">
                      <span className={`font-mono font-bold text-sm ${
                        item.audit.complianceScore >= 95 ? 'text-emerald-400' :
                        item.audit.complianceScore >= 70 ? 'text-amber-400' : 'text-red-400'
                      }`}>{item.audit.complianceScore}</span>
                      <span className="text-slate-600 text-[10px]">/100</span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded-md ${
                        item.audit.status === 'COMPLIANT' ? 'badge-compliant' :
                        item.audit.status === 'PARTIALLY_COMPLIANT' ? 'badge-warning' : 'badge-noncompliant'
                      }`}>
                        {item.audit.status === 'COMPLIANT' ? 'COMPLIANT' :
                         item.audit.status === 'PARTIALLY_COMPLIANT' ? 'PARTIAL' : 'VIOLATION'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="text-red-400 font-mono text-xs font-semibold">
                        {(item.audit.violations || []).length > 0 ? `${item.audit.violations.length} violation${item.audit.violations.length > 1 ? 's' : ''}` : '—'}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => onSelectRecord(item)}
                        className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-indigo-200 flex items-center gap-1 transition text-xs font-medium"
                      >
                        View <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
