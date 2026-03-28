import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Services from "./components/Services/Services.jsx";
import Ministries from "./components/Ministries/Ministries";
import News from "./components/News/News.jsx";
import NewsDetail from "./components/News/NewsDetail";
import Contact from "./components/Contact/Contact.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Login from "./components/Auth/Login";
import ResetPasswordHandler from "./components/Auth/ResetPasswordHandler";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminDashboard from "./components/Admin/AdminDashboard";
import PastorDashboard from "./components/Pastor/PastorDashboard";
import ComunicacionesDashboard from "./components/Comunicaciones/ComunicacionesDashboard";

function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Ministries />
      <News />
      <Contact />
    </>
  );
}

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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/action" element={<ResetPasswordHandler />} />
            <Route path="/noticia/:id" element={<NewsDetail />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pastor"
              element={
                <ProtectedRoute roleRequired="pastor">
                  <PastorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/comunicaciones"
              element={
                <ProtectedRoute roleRequired="comunicaciones">
                  <ComunicacionesDashboard />
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
