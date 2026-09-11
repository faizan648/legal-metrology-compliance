import React from 'react';
import { Layers, Scan, CheckCircle2, AlertOctagon, ArrowRight } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { evaluateCompliance } from '../engine/legalMetrologyRules';

export default function SampleLibrary({ onSelectSample }) {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Benchmark Sample Products Library
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured benchmark datasets covering both fully compliant products and real-world Legal Metrology violation scenarios.
          </p>
        </div>
      </div>

      {/* Grid of Samples */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_PRODUCTS.map((sample) => {
          const audit = evaluateCompliance(sample.productData);
          const isComp = audit.status === 'COMPLIANT';

          return (
            <div 
              key={sample.id}
              className="glass-card p-5 space-y-4 flex flex-col justify-between hover:border-indigo-500/50 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {sample.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded ${
                    isComp ? 'badge-compliant' : 'badge-noncompliant'
                  }`}>
                    {audit.status}
                  </span>
                </div>

                {/* SVG Mini Preview */}
                <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 my-3 flex items-center justify-center p-2">
                  <div 
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: sample.svgLabel }}
                  />
                </div>

                <h3 className="text-base font-bold text-slate-100 font-heading">{sample.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{sample.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">Score: {audit.complianceScore}/100</span>
                <button
                  onClick={() => onSelectSample(sample)}
                  className="btn-primary py-1.5 px-3 text-xs"
                >
                  Load in Scanner <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
