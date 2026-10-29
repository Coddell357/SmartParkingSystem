
import React, { useEffect, useState } from "react";
import parkitechlogo from "../assets/parkitechlogo.png";
import { NavLink } from "react-router-dom";

interface SideBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const SideBar: React.FC<SideBarProps> = ({
  collapsed,
  onToggle,
}) => {

  const [isAdmin, setIsAdmin] = useState(
  sessionStorage.getItem("userRole") === "admin"
);

useEffect(() => {
  const updateRole = () => {
    setIsAdmin(sessionStorage.getItem("userRole") === "admin");
  };

  window.addEventListener("storage", updateRole);

  return () => {
    window.removeEventListener("storage", updateRole);
  };
}, []);

  return (
    <aside className="sidebar">
      <button
        className="sidebar-toggle"
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggle}
      >
        <i
          className="fa-solid fa-chevron-left"
          aria-hidden="true"
        ></i>
      </button>

      <div className="brand">
        <span className="brand-mark">
          <img src={parkitechlogo} alt="Parkitech" />
        </span>

        <span className="brand-copy">
          <strong>Parkitech</strong>
          <small>Smart Parking</small>
        </span>
      </div>

      <nav className="primary-nav" aria-label="Primary navigation">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-table-columns"
            aria-hidden="true"
          ></i>
          <span className="nav-label">Dashboard</span>
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `nav-item ${isActive ? "is-active" : ""}`
            }
          >
            <i
              className="nav-icon fa-solid fa-user-plus"
              aria-hidden="true"
            ></i>
            <span className="nav-label">Register Security</span>
          </NavLink>
        )}

        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-ticket"
            aria-hidden="true"
          ></i>
          <span className="nav-label">Tickets</span>
        </NavLink>

        <NavLink
          to="/responses"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-square-parking"
            aria-hidden="true"
          ></i>
          <span className="nav-label">Ticket Responses</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-chart-line"
            aria-hidden="true"
          ></i>
          <span className="nav-label">Analytics</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "is-active" : ""}`
          }
        >
          <i
            className="nav-icon fa-solid fa-gear"
            aria-hidden="true"
          ></i>
          <span className="nav-label">Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="plan-card">
          <div className="plan-row">
            <span>Parking status</span>
            <strong>Live</strong>
          </div>

          <div className="progress-track">
            <span style={{ width: "72%" }}></span>
          </div>

          <small>Campus parking activity</small>
        </div>

        <button className="sidebar-user" type="button">
          <span className="avatar">P</span>

          <span className="user-copy">
            <strong>Parkitech</strong>
            <small>{isAdmin ? "Administrator" : "Security Personnel"}</small>
          </span>

          <i aria-hidden="true"></i>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
