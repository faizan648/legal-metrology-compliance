import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, ScanLine, FolderSearch, BarChart3, LogOut, Scale, UserCog,
} from "lucide-react";

const linkBase = "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all";
const linkActive = "bg-slate-900 text-white shadow-sm";
const linkIdle = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

export default function AppShell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const nav_items = [
    { to: "/dashboard", label: "Scanner", icon: ScanLine, testid: "nav-scanner" },
    { to: "/history", label: "Inspection History", icon: FolderSearch, testid: "nav-history" },
    { to: "/analytics", label: "Analytics", icon: BarChart3, testid: "nav-analytics" },
  ];
  if (user?.role === "admin") {
    nav_items.push({ to: "/admin/users", label: "Users", icon: UserCog, testid: "nav-users" });
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 grid place-items-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-slate-900 leading-tight">Metrology</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Compliance Engine</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav_items.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={n.testid}
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 grid place-items-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate" data-testid="current-user-name">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="uppercase text-[10px] font-mono" data-testid="current-user-role">
              {user?.role}
            </Badge>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            data-testid="logout-button"
            onClick={async () => { await logout(); nav("/login"); }}
          >
            <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
