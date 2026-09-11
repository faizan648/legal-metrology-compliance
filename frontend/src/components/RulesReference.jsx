import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Scale, 
  FileText, 
  Info, 
  HelpCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { SECOND_SCHEDULE_RULES } from '../engine/legalMetrologyRules';

export default function RulesReference() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRule, setExpandedRule] = useState('rule-6');

  const rulesList = [
    {
      id: 'rule-6',
      number: 'Rule 6',
      title: 'Declarations to be made on every package',
      summary: 'Prescribes mandatory declarations required on retail packaging.',
      content: `Every package shall bear thereon a definite, plain and conspicuous declaration made as to:
(a) Name & complete postal address of the manufacturer, packer or importer (including factory location, street, city, state, PIN code).
(b) Common or generic names of the commodity contained in the package.
(c) Net quantity in terms of standard unit of weight, measure or number.
(d) Month and year in which commodity is manufactured, pre-packed or imported (MM/YYYY).
(e) Maximum Retail Price (MRP Rs ...... incl. of all taxes).
(f) Consumer Care Helpline cell (Name, Address, Phone/Mobile number, Email).`
    },
    {
      id: 'rule-7',
      number: 'Rule 7 & 8',
      title: 'Principal Display Panel - Area, Size, Font & Clearance',
      summary: 'Prescribes minimum numeral height (Tables I & II) and surrounding clearance space.',
      content: `1. Numeral height on Principal Display Panel (PDP) shall not be less than:
- Up to 200g/ml: Normal >= 1mm (Embossed/Blown >= 2mm)
- 200g/ml to 500g/ml: Normal >= 2mm (Embossed/Blown >= 4mm)
- Above 500g/ml: Normal >= 4mm (Embossed/Blown >= 6mm)
2. Height of letters shall not be less than 1 mm height. Width of letter/numeral shall be at least 1/3 of height.
3. Rule 8 Padding: Surrounding area of quantity declaration must be free from printed information by space equal to height (h) above/below and twice height (2h) left/right.`
    },
    {
      id: 'rule-5',
      number: 'Rule 5 & Second Schedule',
      title: 'Standard Package Quantities',
      summary: 'Commodities listed in Second Schedule must be pre-packed in prescribed standard sizes.',
      content: `Commodities specified in the Second Schedule (Biscuits, Tea, Coffee, Edible Oils, Baby Food, Soaps, Salt, Cement, etc.) shall be packed only in specified standard quantities.
Exemption Proviso: If packed in non-standard size, package MUST prominently declare:
"Not a standard pack size under the Legal Metrology (Packaged Commodities) Rules, 2011"`
    },
    {
      id: 'rule-13',
      number: 'Rule 13',
      title: 'Statement of Units of Weight, Measure or Number',
      summary: 'Enforces standard SI units and prohibits non-SI terms or misleading expressions.',
      content: `1. Weight: gram (g) for < 1kg, kilogram (kg) for >= 1kg.
2. Volume: millilitre (ml) for < 1L, litre (l or L) for >= 1L.
3. Length: centimetre (cm) for < 1m, metre (m) for >= 1m.
4. Count: symbol N or U.
Prohibitions: Rule 13(4) prohibits terms like "dozen", "gross", "score". Rule 13(6) prohibits expressions like "minimum", "about", "approx", "not less than".`
    },
    {
      id: 'rule-22',
      number: 'Rule 22 & First Schedule',
      title: 'Maximum Permissible Error (MPE)',
      summary: 'Defines maximum allowed weight/volume deficiency limits.',
      content: `Table I Maximum Permissible Error limits:
- Up to 50g/ml: 9.0%
- 50 to 100g/ml: 4.5 g/ml
- 100 to 200g/ml: 4.5%
- 200 to 300g/ml: 9.0 g/ml
- 300 to 500g/ml: 3.0%
- 500 to 1000g/ml: 15 g/ml
- 1000 to 10000g/ml: 1.5%
- Above 15000g/ml: 1.0%`
    },
    {
      id: 'rule-23',
      number: 'Rule 23',
      title: 'Deceptive Packages & Excessive Slack Fill',
      summary: 'Prohibits package designs intended to misrepresent product volume.',
      content: `A package is deemed deceptive if designed to deliberately give an exaggerated or misleading impression as to the quantity contained (excessive empty air space / slack fill > 25%), unless justified for product protection or machine filling requirements.`
    },
    {
      id: 'rule-32',
      number: 'Rule 32',
      title: 'Penalties for Contravention',
      summary: 'Fines and legal action for non-compliance.',
      content: `1. Contravention of registration rules (Rules 27 to 31): Fine of ₹4,000.
2. Contravention of any other provision (Rules 6, 7, 8, 9, 13, 23): Fine of ₹2,000 per violation.`
    }
  ];

  const filteredRules = rulesList.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            Legal Metrology (Packaged Commodities) Rules, 2011 Reference
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative guide to mandatory declarations, font dimensions, standard pack sizes, and MPE limits.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Rules & Schedules..."
            className="input-field text-xs pl-9"
          />
        </div>
      </div>

      {/* Grid: Rules Accordion (7 cols) & Reference Tables (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Rules Accordion List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredRules.map((rule) => {
            const isExp = expandedRule === rule.id;
            return (
              <div 
                key={rule.id}
                className="glass-card overflow-hidden transition border border-slate-800/80 hover:border-slate-700"
              >
                <button
                  onClick={() => setExpandedRule(isExp ? null : rule.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-900/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {rule.number}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{rule.title}</h3>
                      <p className="text-xs text-slate-400">{rule.summary}</p>
                    </div>
                  </div>
                  {isExp ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>

                {isExp && (
                  <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                    {rule.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reference Tables (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Table I & II Font Size Summary */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              Table I Font Height Matrix (Rule 7)
            </h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                  <th className="py-2">Net Quantity</th>
                  <th className="py-2">Normal</th>
                  <th className="py-2">Blown / Embossed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                <tr>
                  <td className="py-2">Up to 200 g/ml</td>
                  <td className="py-2 font-mono text-cyan-300">1 mm</td>
                  <td className="py-2 font-mono text-indigo-300">2 mm</td>
                </tr>
                <tr>
                  <td className="py-2">200g - 500 g/ml</td>
                  <td className="py-2 font-mono text-cyan-300">2 mm</td>
                  <td className="py-2 font-mono text-indigo-300">4 mm</td>
                </tr>
                <tr>
                  <td className="py-2">Above 500 g/ml</td>
                  <td className="py-2 font-mono text-cyan-300">4 mm</td>
                  <td className="py-2 font-mono text-indigo-300">6 mm</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Second Schedule Standard Pack Sizes */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              Second Schedule Prescribed Pack Sizes
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {Object.entries(SECOND_SCHEDULE_RULES).map(([cat, cfg], idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                  <div className="font-bold text-slate-200 mb-1">{cat}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Units: {cfg.units.join(', ')} | Allowed: {cfg.allowed ? cfg.allowed.slice(0, 6).join(', ') + '...' : 'Multiples of ' + cfg.stepAbove + 'g'}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
