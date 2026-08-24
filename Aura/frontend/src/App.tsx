import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import CookieConsent from "./components/consent/CookieConsent";
import { CloudNavigationProvider } from "./components/experience/CloudTunnelTransition";
import ZCursorFollower from "./components/experience/ZCursorFollower";

export default function App() {
  return (
    <CloudNavigationProvider>
      <ZCursorFollower />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-small focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CookieConsent />
    </CloudNavigationProvider>
  );
}
