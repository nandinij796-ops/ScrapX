import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RefreshCw } from "lucide-react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userData, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-[#0F172A]">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-600">Verifying ScrapX Security Session...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required
  if (allowedRoles && allowedRoles.length > 0) {
    // Admins always have access
    if (isAdmin) {
      return children;
    }

    const currentRole = userData?.role;
    if (!currentRole || !allowedRoles.includes(currentRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
