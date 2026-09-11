import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, formatApiError } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Scale, Loader2 } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, name);
      toast.success("Officer account created");
      nav("/dashboard");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-lg bg-slate-900 grid place-items-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <p className="font-display font-bold text-slate-900">Metrology Compliance</p>
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">New Officer Registration</p>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Create your account</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} data-testid="register-name-input" />
            </div>
            <div className="space-y-2">
              <Label>Official Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="register-email-input" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} data-testid="register-password-input" />
            </div>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 h-11" disabled={loading} data-testid="register-submit-button">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
            </Button>
            <p className="text-sm text-slate-500 text-center">
              Already registered?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline" data-testid="link-login">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
