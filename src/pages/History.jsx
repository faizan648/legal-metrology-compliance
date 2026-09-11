import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileSearch, ChevronRight, Loader2 } from "lucide-react";

const verdictBadge = {
  COMPLIANT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PARTIALLY_COMPLIANT: "bg-amber-50 text-amber-700 border-amber-200",
  NON_COMPLIANT: "bg-red-50 text-red-700 border-red-200",
};

export default function History() {
  const [scans, setScans] = useState([]);
  const [q, setQ] = useState("");
  const [verdict, setVerdict] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (verdict !== "all") params.verdict = verdict;
      const { data } = await api.get("/scans", { params });
      setScans(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [verdict]);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [q]);

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Repository</p>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Inspection History</h1>
        <p className="text-slate-600 mt-1">Search and review all previously scanned commodities and their compliance verdicts.</p>
      </header>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by product or manufacturer…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
            data-testid="history-search-input"
          />
        </div>
        <Select value={verdict} onValueChange={setVerdict}>
          <SelectTrigger className="w-56" data-testid="history-verdict-filter">
            <SelectValue placeholder="All verdicts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All verdicts</SelectItem>
            <SelectItem value="COMPLIANT">Compliant</SelectItem>
            <SelectItem value="PARTIALLY_COMPLIANT">Partial</SelectItem>
            <SelectItem value="NON_COMPLIANT">Non-Compliant</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm text-slate-500 font-mono" data-testid="history-count">
          {scans.length} record{scans.length !== 1 && "s"}
        </div>
      </div>

      {loading ? (
        <div className="p-16 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : scans.length === 0 ? (
        <Card className="border-dashed border-slate-300 bg-slate-50/50">
          <CardContent className="p-16 text-center">
            <FileSearch className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <p className="font-display font-semibold text-slate-700">No inspections yet</p>
            <p className="text-sm text-slate-500 mt-1">Head over to the Scanner to create your first compliance record.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {scans.map((s) => {
            const c = s.compliance || {};
            return (
              <Link key={s.id} to={`/scans/${s.id}`} className="block group" data-testid={`history-item-${s.id}`}>
                <Card className="border-slate-200 card-hover h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className={`${verdictBadge[c.verdict] || ""} border text-[10px] uppercase font-mono tracking-wider`}>
                        {c.verdict?.replace("_", " ")}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="font-display font-bold text-slate-900 text-lg leading-tight line-clamp-2 mb-1">
                      {s.extracted?.product_name || s.product_hint || "Untitled product"}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                      {s.extracted?.manufacturer_name || "Unknown manufacturer"}
                    </p>
                    <div className="flex items-end gap-2 pt-3 border-t border-slate-100">
                      <span className="font-display text-3xl font-extrabold text-slate-900">{c.score || 0}</span>
                      <span className="text-slate-500 text-xs mb-1.5 font-mono">/100</span>
                      <span className="ml-auto text-[11px] text-slate-500 font-mono">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
