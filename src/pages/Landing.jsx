import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, ScanLine, ShieldCheck, FileText, ArrowRight, Zap } from "lucide-react";

const features = [
  { icon: ScanLine, title: "Snap & Scan", desc: "Upload any product label. Get all mandatory declarations parsed instantly." },
  { icon: ShieldCheck, title: "Rule Engine", desc: "Every scan is validated against seven mandatory declarations of PCR 2011." },
  { icon: FileText, title: "Court-Ready Reports", desc: "Export PDF & DOCX inspection reports for legal enforcement action." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-900 grid place-items-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-slate-900 leading-tight">Metrology</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Compliance Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" data-testid="landing-signin-button">Sign In</Button></Link>
          <Link to="/register"><Button className="bg-slate-900 hover:bg-slate-800" data-testid="landing-getstarted-button">Get Started</Button></Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-6">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-mono uppercase tracking-widest text-blue-700">Powered by Gemini 3.1 Pro Vision</span>
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6">
              Enforce the<br />
              <span className="text-blue-600">Legal Metrology Act</span><br />
              in one click.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              A precision instrument for enforcement officers — instantly extract every mandatory declaration from any packaged commodity image and generate compliance reports under Packaged Commodities Rules, 2011.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/register">
                <Button className="bg-slate-900 hover:bg-slate-800 h-12 px-6 text-base" data-testid="hero-cta-button">
                  Start Scanning <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="h-12 px-6 text-base" data-testid="hero-signin-button">Officer Sign In</Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "7", v: "Mandatory Checks" },
                { k: "<3s", v: "Per Scan" },
                { k: "PDF+DOCX", v: "Reports" },
              ].map((s) => (
                <div key={s.v} className="border-l-2 border-slate-900 pl-3">
                  <p className="font-display text-2xl font-extrabold text-slate-900">{s.k}</p>
                  <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-2xl bg-white">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" alt="Product label"
                className="w-full h-96 object-cover" />
              <div className="p-5 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-ring" />
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-700">Live Scan Preview</span>
                </div>
                <p className="font-display text-lg font-bold text-slate-900">Organic Oats 500g</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div><span className="text-slate-500 font-mono">MRP</span> <span className="font-semibold">₹ 185 (incl.)</span></div>
                  <div><span className="text-slate-500 font-mono">Net Qty</span> <span className="font-semibold">500 g</span></div>
                  <div><span className="text-slate-500 font-mono">Mfg</span> <span className="font-semibold">Dec 2025</span></div>
                  <div><span className="text-slate-500 font-mono">Verdict</span> <span className="text-emerald-600 font-semibold">COMPLIANT</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">How it works</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 mb-10 max-w-2xl">
            Field-grade enforcement in three swift moves.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="p-6 rounded-xl border border-slate-200 bg-slate-50 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 grid place-items-center">
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-mono text-xs text-slate-400">0{i + 1}</span>
                </div>
                <p className="font-display text-xl font-bold text-slate-900 mb-2">{f.title}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs font-mono text-slate-500">
        Prototype · Legal Metrology (Packaged Commodities) Rules, 2011 · Emergent
      </footer>
    </div>
  );
}
