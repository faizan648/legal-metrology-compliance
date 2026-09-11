import React from 'react';
import { 
  ShieldCheck, 
  Scan, 
  LayoutDashboard, 
  Database, 
  BookOpen, 
  Layers, 
  UserCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userRole, setUserRole }) {
  const navItems = [
    { id: 'scanner', label: 'Product Scanner', icon: Scan },
    { id: 'dashboard', label: 'Enforcement Dashboard', icon: LayoutDashboard },
    { id: 'repository', label: 'Inspection Repository', icon: Database },
    { id: 'rules', label: 'Legal Metrology Rules 2011', icon: BookOpen },
    { id: 'samples', label: 'Sample Library', icon: Layers }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                LM-Compliance 2011
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Rules 2011 Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Legal Metrology (Packaged Commodities) Enforcement & Verification System
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Role Toggle Switch */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="bg-transparent text-xs font-semibold text-indigo-300 focus:outline-none cursor-pointer"
          >
            <option value="officer" className="bg-slate-900 text-slate-200">Enforcement Officer / Inspector</option>
            <option value="manufacturer" className="bg-slate-900 text-slate-200">Commodity Manufacturer / Packer</option>
          </select>
        </div>

      </div>
    </header>
  );
}
