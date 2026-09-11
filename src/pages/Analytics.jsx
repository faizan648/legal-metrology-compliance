import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { CheckCircle2, AlertTriangle, XCircle, Package, Loader2 } from "lucide-react";

const COLORS = { COMPLIANT: "#10b981", PARTIALLY_COMPLIANT: "#f59e0b", NON_COMPLIANT: "#ef4444" };

export default function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/analytics/overview").then((r) => setData(r.data));
  }, []);
  if (!data) return <div className="p-16 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const pieData = [
    { name: "Compliant", value: data.compliant, color: COLORS.COMPLIANT },
    { name: "Partial", value: data.partial, color: COLORS.PARTIALLY_COMPLIANT },
    { name: "Non-Compliant", value: data.non_compliant, color: COLORS.NON_COMPLIANT },
  ].filter((x) => x.value > 0);

  const stats = [
    { label: "Total Scans", value: data.total, icon: Package, tint: "bg-slate-900 text-white", testid: "stat-total" },
    { label: "Compliant", value: data.compliant, icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-700 border-emerald-200 border", testid: "stat-compliant" },
    { label: "Partial", value: data.partial, icon: AlertTriangle, tint: "bg-amber-50 text-amber-700 border-amber-200 border", testid: "stat-partial" },
    { label: "Non-Compliant", value: data.non_compliant, icon: XCircle, tint: "bg-red-50 text-red-700 border-red-200 border", testid: "stat-noncompliant" },
  ];

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Enforcement Analytics</p>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Compliance Dashboard</h1>
        <p className="text-slate-600 mt-1">Live metrics across inspections, violations and manufacturers.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-5 ${s.tint}`} data-testid={s.testid}>
            <div className="flex items-center justify-between mb-4">
              <s.icon className="w-5 h-5 opacity-80" />
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">{s.label}</span>
            </div>
            <p className="font-display text-4xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-200 lg:col-span-1">
          <CardContent className="p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Compliance Rate</p>
            <p className="font-display text-3xl font-extrabold text-slate-900 mb-4">{data.compliance_rate}%</p>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData.length ? pieData : [{ name: "No data", value: 1, color: "#e2e8f0" }]}
                    dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {(pieData.length ? pieData : [{ color: "#e2e8f0" }]).map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-3 text-sm">
              {pieData.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />
                    <span className="text-slate-700">{p.name}</span>
                  </div>
                  <span className="font-mono text-slate-900">{p.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 lg:col-span-2">
          <CardContent className="p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Inspections Trend</p>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={data.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={2} name="Total" />
                  <Line type="monotone" dataKey="compliant" stroke="#10b981" strokeWidth={2} name="Compliant" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 lg:col-span-2">
          <CardContent className="p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Most Violated Rules</p>
            {data.rule_violations?.length ? (
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={data.rule_violations.slice(0, 7)} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                    <YAxis type="category" dataKey="rule" stroke="#94a3b8" fontSize={10} width={200} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-10 text-center">No violations detected yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Top Non-Compliant Manufacturers</p>
            {data.top_violators?.length ? (
              <div className="space-y-2">
                {data.top_violators.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-md bg-red-600 text-white grid place-items-center font-mono text-sm font-bold">{i + 1}</span>
                      <span className="font-medium text-slate-900 truncate">{v.manufacturer || "—"}</span>
                    </div>
                    <span className="font-mono text-red-700 font-bold">{v.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-10 text-center">Nothing here yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
