import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/users").then((r) => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Administration</p>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Users & Officers</h1>
      </header>
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      ) : (
        <Card className="border-slate-200">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left border-b border-slate-200">
                <tr className="text-xs uppercase tracking-wider text-slate-500 font-mono">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50" data-testid={`user-row-${u.id}`}>
                    <td className="p-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white grid place-items-center text-xs font-bold">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-mono text-xs">{u.email}</td>
                    <td className="p-4">
                      <Badge variant={u.role === "admin" ? "default" : "outline"} className="uppercase font-mono text-[10px]">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
