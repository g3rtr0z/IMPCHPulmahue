import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roleRequired }) {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/" />;
    }

    if (roleRequired) {
        const hasRole = Array.isArray(roleRequired)
            ? roleRequired.includes(userRole)
            : userRole === roleRequired;

        if (!hasRole) {
            // Redirección inteligente: Si intentas entrar a un portal ajeno, te mando al TUYO.
            if (userRole === 'admin') return <Navigate to="/admin" />;
            if (userRole === 'pastor') return <Navigate to="/pastor" />;
            if (userRole === 'comunicaciones') return <Navigate to="/comunicaciones" />;
            return <Navigate to="/" />;
        }
    }

    return children;
}
