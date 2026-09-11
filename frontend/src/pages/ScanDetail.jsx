import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, FileText, FileType2, CheckCircle2, AlertTriangle, XCircle,
  Loader2, Trash2, ChevronDown, ChevronUp, ScanText, Cpu,
} from "lucide-react";
import { formatApiError } from "@/context/AuthContext";

const verdictConfig = {
  COMPLIANT: { color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Compliant" },
  PARTIALLY_COMPLIANT: { color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", label: "Partial" },
  NON_COMPLIANT: { color: "bg-red-500", text: "text-red-700", bg: "bg-red-50", border: "border-red-200", label: "Non-Compliant" },
};

const StatusIcon = ({ status }) => {
  if (status === "pass") return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
  if (status === "warning") return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
  return <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />;
};

function RawOcrPanel({ rawText }) {
  const [open, setOpen] = useState(false);
  if (!rawText) return null;
  return (
    <Card className="border-slate-200">
      <CardContent className="p-0">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors rounded-xl"
        >
          <div className="flex items-center gap-2">
            <ScanText className="w-4 h-4 text-slate-500" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
              Raw OCR Text — Verbatim Pixel Extraction
            </p>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {open && (
          <div className="px-5 pb-5 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 mt-3 mb-2">
              Complete text extracted from the label image pixels before AI structuring:
            </p>
            <pre className="bg-slate-950 text-slate-100 text-xs font-mono p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {rawText}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ScanDetail() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/scans/${id}`);
        setScan(data);
      } catch (e) {
        toast.error(formatApiError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const download = async (kind) => {
    try {
      const res = await api.get(`/scans/${id}/report.${kind}`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compliance-report-${id.slice(0, 8)}.${kind}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const del = async () => {
    if (!window.confirm("Delete this scan permanently?")) return;
    try {
      await api.delete(`/scans/${id}`);
      toast.success("Scan deleted");
      nav("/history");
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  if (loading) return <div className="p-12 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!scan) return <div className="p-12 text-slate-600">Scan not found.</div>;

  const c = scan.compliance || {};
  const v = verdictConfig[c.verdict] || verdictConfig.NON_COMPLIANT;
  const ext = scan.extracted || {};

  const fields = [
    ["Product Name", ext.product_name],
    ["Manufacturer", ext.manufacturer_name],
    ["Manufacturer Address", ext.manufacturer_address],
    ["Net Quantity", ext.net_quantity],
    ["MRP", ext.mrp],
    ["Mfg Date", ext.mfg_date],
    ["Expiry / Best Before", ext.expiry_date],
    ["Consumer Care", ext.consumer_care],
    ["Country of Origin", ext.country_of_origin],
    ["FSSAI Number", ext.fssai_number],
    ["Batch Number", ext.batch_number],
    ["Ingredients", ext.ingredients],
  ];

  // Determine processing method used
  const hasRawText = ext.raw_text && ext.raw_text.trim().length > 10;
  const processingMethod = hasRawText
    ? (scan.ai_structured ? "Gemini AI Structured from OCR" : "Local OCR + NLP Heuristics")
    : "Benchmark Fallback";

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900" data-testid="back-to-history">
          <ArrowLeft className="w-4 h-4" /> Back to Inspection History
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => download("pdf")} data-testid="export-pdf-report-button">
            <FileText className="w-4 h-4 mr-1.5" /> PDF Report
          </Button>
          <Button variant="outline" onClick={() => download("docx")} data-testid="export-docx-report-button">
            <FileType2 className="w-4 h-4 mr-1.5" /> DOCX Report
          </Button>
          <Button variant="outline" onClick={del} className="text-red-600 hover:text-red-700" data-testid="delete-scan-button">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <header className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Inspection Report</p>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight" data-testid="scan-product-title">
          {ext.product_name || scan.product_hint || "Untitled Product"}
        </h1>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <Badge className={`${v.bg} ${v.text} ${v.border} border`} data-testid="scan-verdict-badge">
            <span className={`w-1.5 h-1.5 rounded-full ${v.color} mr-1.5`} /> {v.label}
          </Badge>
          <span className="text-sm text-slate-500 font-mono">Score {c.score}%</span>
          <span className="text-sm text-slate-500 font-mono">· {new Date(scan.created_at).toLocaleString()}</span>
          <span className="text-sm text-slate-500 font-mono">· by {scan.scanned_by_email}</span>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            <Cpu className="w-3 h-3" /> {processingMethod}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 overflow-hidden">
            <img src={`data:${scan.mime_type || "image/jpeg"};base64,${scan.image_base64}`} alt="scan" className="w-full object-contain bg-slate-100 max-h-[400px]" data-testid="scan-image" />
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">Compliance Score</p>
              <div className="flex items-end gap-3 mb-3">
                <span className="font-display text-5xl font-extrabold text-slate-900" data-testid="scan-score">{c.score}</span>
                <span className="text-slate-500 mb-1.5">/ 100</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full transition-all duration-500 ${v.color}`} style={{ width: `${c.score}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center p-2 rounded-lg bg-emerald-50">
                  <p className="font-mono text-2xl font-bold text-emerald-700">{c.summary?.passed || 0}</p>
                  <p className="text-[10px] uppercase tracking-wide text-emerald-700 font-mono">Pass</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-50">
                  <p className="font-mono text-2xl font-bold text-amber-700">{c.summary?.warnings || 0}</p>
                  <p className="text-[10px] uppercase tracking-wide text-amber-700 font-mono">Warn</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-red-50">
                  <p className="font-mono text-2xl font-bold text-red-700">{c.summary?.failed || 0}</p>
                  <p className="text-[10px] uppercase tracking-wide text-red-700 font-mono">Fail</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* AI Structured Declarations */}
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Extracted Declarations</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {fields.map(([k, val]) => (
                  <div key={k}>
                    <p className="text-[11px] uppercase font-mono tracking-wide text-slate-500">{k}</p>
                    <p className={`mt-0.5 text-sm ${val ? "text-slate-900 font-medium" : "text-slate-400 italic"}`}>
                      {val || "— not detected —"}
                    </p>
                  </div>
                ))}
              </div>
              {scan.notes && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-[11px] uppercase font-mono tracking-wide text-slate-500 mb-1">Officer Notes</p>
                  <p className="text-sm text-slate-700">{scan.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Raw OCR text panel (collapsible) */}
          <RawOcrPanel rawText={ext.raw_text} />

          {/* Rule-by-Rule verdict */}
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Rule-by-Rule Verdict — PCR 2011</p>
              <div className="space-y-2">
                {(c.checks || []).map((chk) => (
                  <div
                    key={chk.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${chk.status === "pass" ? "status-pass" : chk.status === "warning" ? "status-warn" : "status-fail"}`}
                    data-testid={`rule-check-${chk.id}`}
                  >
                    <StatusIcon status={chk.status} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/70 border border-current/20">{chk.rule}</span>
                        <span className="font-semibold text-sm">{chk.label}</span>
                      </div>
                      {chk.value && <p className="text-xs text-slate-700 mt-1 font-mono truncate">Val: {chk.value}</p>}
                      {chk.note && <p className="text-xs mt-1 italic">{chk.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {c.violations?.length > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-red-700 mb-3">Violation Summary</p>
                <ul className="space-y-1.5">
                  {c.violations.map((v, i) => (
                    <li key={i} className="text-sm text-red-900 flex gap-2">
                      <span>•</span> <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
