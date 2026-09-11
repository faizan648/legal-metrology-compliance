import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppShell from "@/components/AppShell";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Scanner from "@/pages/Scanner";
import ScanDetail from "@/pages/ScanDetail";
import History from "@/pages/History";
import Analytics from "@/pages/Analytics";
import Users from "@/pages/Users";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Scanner />} />
            <Route path="/history" element={<History />} />
            <Route path="/scans/:id" element={<ScanDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin/users" element={<ProtectedRoute admin><Users /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
