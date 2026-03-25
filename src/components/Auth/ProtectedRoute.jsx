import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roleRequired }) {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (roleRequired) {
        const hasRole = Array.isArray(roleRequired)
            ? roleRequired.includes(userRole)
            : userRole === roleRequired || userRole === 'admin';

        if (!hasRole) {
            return <Navigate to="/" />;
        }
    }

    return children;
}
