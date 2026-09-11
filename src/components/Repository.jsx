import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertOctagon, 
  Trash2,
  Download
} from 'lucide-react';

export default function Repository({ repositoryData, onSelectRecord, onDeleteRecord }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Filter repository items
  const filteredData = repositoryData.filter(item => {
    const matchesSearch = 
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.product.manufacturerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.audit.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || item.product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-400" />
            Scanned Products &amp; Compliance Repository
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Searchable historical database of inspected packaged commodities, violation records, and digital evidence.
          </p>
        </div>
        <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
          Total Records: {repositoryData.length}
        </div>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="glass-card p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Product Name, Manufacturer, or Brand..."
            className="input-field text-xs pl-9"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field text-xs cursor-pointer"
          >
            <option value="ALL">All Compliance Statuses</option>
            <option value="COMPLIANT">Compliant Only</option>
            <option value="NON_COMPLIANT">Non-Compliant Only</option>
            <option value="PARTIALLY_COMPLIANT">Partially Compliant</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field text-xs cursor-pointer"
          >
            <option value="ALL">All Product Categories</option>
            <option value="Edible Oils, Vanaspati, Ghee">Edible Oils &amp; Ghee</option>
            <option value="Biscuits">Biscuits</option>
            <option value="Non-soapy detergents">Detergents &amp; Soaps</option>
            <option value="Confectionery">Confectionery</option>
            <option value="Tea">Tea</option>
          </select>
        </div>

      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center text-slate-500 space-y-2">
            <Database className="w-12 h-12 mx-auto stroke-1" />
            <p className="text-sm">No records found matching search filters.</p>
          </div>
        ) : (
          filteredData.map((item, idx) => {
            const isComp = item.audit.status === 'COMPLIANT';
            return (
              <div 
                key={idx} 
                className="glass-card p-5 space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.product.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded ${
                      isComp ? 'badge-compliant' : 'badge-noncompliant'
                    }`}>
                      {item.audit.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 font-heading line-clamp-1">{item.product.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    Mfg: {item.product.manufacturerName || 'Unknown Manufacturer'}
                  </p>

                  <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Net Qty:</span>
                      <span className="text-slate-200">{item.product.netQuantityValue} {item.product.netQuantityUnit}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Declared MRP:</span>
                      <span className="text-emerald-400">₹{item.product.mrpValue}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Score:</span>
                      <span className="text-cyan-300 font-bold">{item.audit.complianceScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onSelectRecord(item)}
                    className="btn-secondary py-1.5 px-3 text-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> View Full Audit Report
                  </button>
                  {onDeleteRecord && (
                    <button
                      onClick={() => onDeleteRecord(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
