
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";

import { BookPage } from "./pages/BookPage";
import { HealthCheckPage } from "./pages/HealthCheckPage";
import { TicketsPage } from "./pages/TicketsPage";
import { TicketResponsesPage } from "./pages/TicketResponsesPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { SecurityList } from "./pages/SecurityList";
import { EditSecurity } from "./pages/EditSecurity";

type UserRole = "admin" | "security";

const RequireRole: React.FC<{
  children: React.ReactElement;
  allowedRoles: UserRole[];
}> = ({ children, allowedRoles }) => {
  const role = sessionStorage.getItem("userRole") as UserRole | null;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RequireSecurityOrAdmin: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => (
  <RequireRole allowedRoles={["admin", "security"]}>
    {children}
  </RequireRole>
);

const RequireAdmin: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => (
  <RequireRole allowedRoles={["admin"]}>
    {children}
  </RequireRole>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className={
        isLoginPage
          ? ""
          : `app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`
      }
    >
      {!isLoginPage && (
        <SideBar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      <div className={isLoginPage ? "" : "workspace"}>
        {!isLoginPage && <TopBar />}

        <main className={isLoginPage ? "" : "page-wrap"}>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Only administrators can register security personnel. */}
            <Route
              path="/register"
              element={
                <RequireAdmin>
                  <Register />
                </RequireAdmin>
              }
            />

            {/* Only administrators can view and manage security personnel. */}
            <Route
              path="/security-list"
              element={
                <RequireAdmin>
                  <SecurityList />
                </RequireAdmin>
              }
            />

            <Route
              path="/security-list/:id/edit"
              element={
                <RequireAdmin>
                  <EditSecurity />
                </RequireAdmin>
              }
            />

            {/* Both administrators and security personnel can access these pages. */}
            <Route
              path="/dashboard"
              element={
                <RequireSecurityOrAdmin>
                  <BookPage />
                </RequireSecurityOrAdmin>
              }
            />

            <Route
              path="/tickets"
              element={
                <RequireSecurityOrAdmin>
                  <TicketsPage />
                </RequireSecurityOrAdmin>
              }
            />

            <Route
              path="/responses"
              element={
                <RequireSecurityOrAdmin>
                  <TicketResponsesPage />
                </RequireSecurityOrAdmin>
              }
            />

            <Route
              path="/analytics"
              element={
                <RequireSecurityOrAdmin>
                  <AnalyticsPage />
                </RequireSecurityOrAdmin>
              }
            />

            <Route
              path="/settings"
              element={
                <RequireSecurityOrAdmin>
                  <SettingsPage />
                </RequireSecurityOrAdmin>
              }
            />

            <Route
              path="/health"
              element={
                <RequireSecurityOrAdmin>
                  <HealthCheckPage />
                </RequireSecurityOrAdmin>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
