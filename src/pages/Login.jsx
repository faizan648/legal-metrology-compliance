import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, formatApiError } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Scale, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@lm.gov.in");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Signed in successfully");
      nav("/dashboard");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5 bg-slate-50">
      <div className="lg:col-span-3 relative overflow-hidden bg-slate-900 text-white p-12 flex flex-col justify-between hidden lg:flex">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center backdrop-blur">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-lg">Metrology Compliance Engine</p>
            <p className="text-[11px] uppercase tracking-widest text-slate-400 font-mono">Govt. of India Enforcement Tool</p>
          </div>
        </div>
        <div className="relative max-w-lg">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">Packaged Commodities Rules, 2011</p>
          <h1 className="font-display text-5xl font-extrabold leading-tight mb-4">
            Scan. Detect.<br />
            <span className="text-blue-400">Enforce compliance.</span>
          </h1>
          <p className="text-slate-300 leading-relaxed">
            A precision instrument for field officers — instantly parse product labels, validate every mandatory declaration under the Legal Metrology Act, 2009, and generate court-ready reports.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-4 text-xs">
          {[
            { k: "01", v: "Auto OCR" },
            { k: "02", v: "Rule Engine" },
            { k: "03", v: "PDF / DOCX" },
          ].map((s) => (
            <div key={s.k} className="border-l-2 border-blue-500 pl-3">
              <p className="font-mono text-slate-500">{s.k}</p>
              <p className="font-semibold text-slate-100">{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md border-slate-200 shadow-xl">
          <CardContent className="p-8">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Officer Sign-in</p>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-6">Welcome back</h2>
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Official Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@lm.gov.in"
                  data-testid="login-email-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="login-password-input"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 h-11"
                disabled={loading}
                data-testid="login-submit-button"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
              </Button>
              <p className="text-sm text-slate-500 text-center">
                No account?{" "}
                <Link to="/register" className="text-blue-600 font-medium hover:underline" data-testid="link-register">
                  Register as officer
                </Link>
              </p>
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1 font-mono">
                <p>Demo · admin@lm.gov.in / admin123</p>
                <p>Demo · officer@lm.gov.in / officer123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
