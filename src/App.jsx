import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// New Page Imports
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import AuthActionPage from "./pages/Auth/AuthActionPage";
import NewsDetailPage from "./pages/News/NewsDetailPage";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import PastorDashboardPage from "./pages/Pastor/PastorDashboardPage";
import ComunicacionesDashboardPage from "./pages/Comunicaciones/ComunicacionesDashboardPage";

function App() {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/pastor") ||
    location.pathname.startsWith("/comunicaciones");

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/auth/action";

  const hideLayout = isDashboardRoute || isAuthRoute;

  return (
    <AuthProvider>
      <div
        className={`flex flex-col min-h-screen ${hideLayout ? "h-screen overflow-hidden" : ""}`}
      >
        {!hideLayout && <Header />}
        <main className={hideLayout ? "h-full w-full" : "flex-grow"}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/action" element={<AuthActionPage />} />
            <Route path="/noticia/:id" element={<NewsDetailPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pastor"
              element={
                <ProtectedRoute roleRequired="pastor">
                  <PastorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/comunicaciones"
              element={
                <ProtectedRoute roleRequired="comunicaciones">
                  <ComunicacionesDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {!hideLayout && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
