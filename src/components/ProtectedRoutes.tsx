import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean; // optional, restrict route to admins
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;

      if (adminOnly) {
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);
        setAuthorized(adminSnap.exists());
      } else {
        setAuthorized(true);
      }

      setChecking(false);
    };

    checkAdmin();
  }, [user, adminOnly]);

  if (loading || checking) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !authorized) {
    return <Navigate to="/dashboard" replace />; // redirect non-admins
  }

  return <>{children}</>;
};

export default ProtectedRoute;
