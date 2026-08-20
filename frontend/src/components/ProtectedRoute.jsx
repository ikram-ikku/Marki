//import { Navigate, Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 

//export default function ProtectedRoute({ allowedRoles = [] }) {
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="shop-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p className="shop-eyebrow">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If the user doesn't have the required role, redirect to appropriate default
    if (user.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
  // return <Outlet />;
}
