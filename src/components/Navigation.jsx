import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { WalletButton } from "../components/LoadAppKit";

const navTextStyle = {
  color: "#0d6efd",
  fontWeight: 600,
  fontSize: "1rem",
  textDecoration: "none",
  cursor: "pointer",
  userSelect: "none",
};

const activeColor = "#0d6efd";

function Navigation() {
  const renderNavLink = (to, label) => (
    <NavLink
      key={to}
      to={to}
      style={({ isActive }) => ({
        ...navTextStyle,
        color: isActive ? activeColor : navTextStyle.color,
      })}
    >
      {label}
    </NavLink>
  );

  return (
    <>
      <nav
        style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          {renderNavLink("/", "Home")}
          {renderNavLink("/rolepicker", "Role Picker")}
          {renderNavLink("/creator", "Creator")}
          {renderNavLink("/contributor", "Contributor")}
        </div>

        <div style={{ display: "flex", alignItems: "center", color: "#0d6efd" }}>
          <WalletButton />
        </div>
      </nav>

      <main className="container" style={{ paddingTop: "1rem" }}>
        <Outlet />
      </main>
    </>
  );
}

export default Navigation;