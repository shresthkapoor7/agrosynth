import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import HeatmapPage from "./pages/HeatmapPage";
import UserAlertsPage from "./pages/UserAlertsPage";
import WindyEmbed from "./pages/WindyEmbed";
import AIAlertsPage from "./pages/AIAlertsPage";
import HomePage from "./pages/HomePage";
import CreateAlert from "./pages/CreateAlert";

function NavigationBar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navLinkStyle = (path) => ({
    padding: "0.75rem 1rem",
    textDecoration: "none",
    color: isActive(path) ? "white" : "#495057",
    borderRadius: "6px",
    backgroundColor: isActive(path) ? "#2196F3" : "#e9ecef",
    transition: "all 0.3s ease",
    fontWeight: isActive(path) ? "600" : "400",
    fontSize: "0.95rem",
    whiteSpace: "nowrap",
    display: "block",
    textAlign: "center"
  });

  const hamburgerStyle = {
    display: "none",
    flexDirection: "column",
    cursor: "pointer",
    padding: "0.5rem",
    backgroundColor: "#e9ecef",
    borderRadius: "4px",
    border: "none",
    gap: "3px",
    zIndex: 2000,
    position: "relative"
  };

  const hamburgerLineStyle = {
    width: "20px",
    height: "2px",
    backgroundColor: "#495057",
    transition: "all 0.3s ease"
  };

  return (
    <nav
      style={{
        padding: "0.75rem 1rem",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #dee2e6",
        position: "sticky",
        top: 0,
        zIndex: 9999,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      {/* Desktop Navigation */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
        className="desktop-nav"
      >
        <Link to="/" style={navLinkStyle('/')}>Home</Link>
        <Link to="/user-alerts" style={navLinkStyle('/user-alerts')}>User Alerts</Link>
        <Link to="/windy" style={navLinkStyle('/windy')}>Windy Map</Link>
        <Link to="/ai-alerts" style={navLinkStyle('/ai-alerts')}>AI Alerts</Link>
        <Link to="/create-alert" style={navLinkStyle('/create-alert')}>Report Alert</Link>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={hamburgerStyle}
        className="mobile-menu-btn"
        aria-label="Toggle mobile menu"
      >
        <div style={hamburgerLineStyle}></div>
        <div style={hamburgerLineStyle}></div>
        <div style={hamburgerLineStyle}></div>
      </button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "1rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
          className="mobile-nav"
        >
          <Link
            to="/"
            style={navLinkStyle('/')}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/user-alerts"
            style={navLinkStyle('/user-alerts')}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            User Alerts
          </Link>
          <Link
            to="/windy"
            style={navLinkStyle('/windy')}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Windy Map
          </Link>
          <Link
            to="/ai-alerts"
            style={navLinkStyle('/ai-alerts')}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            AI Alerts
          </Link>
          <Link
            to="/create-alert"
            style={navLinkStyle('/create-alert')}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Report Alert
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
            margin: 0 auto;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-nav {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          nav {
            padding: 0.5rem !important;
          }
        }

        /* Hover effects for desktop */
        @media (min-width: 769px) {
          .desktop-nav a:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </nav>
  );
}

function App() {
  return (
    <Router basename="/agrosynth">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#f8f9fa",
        }}
      >
        <NavigationBar />
        <main
          style={{
            flex: 1,
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0.75rem",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user-alerts" element={<UserAlertsPage />} />
            <Route path="/windy" element={<WindyEmbed />} />
            <Route path="/ai-alerts" element={<AIAlertsPage />} />
            <Route path="/create-alert" element={<CreateAlert />} />
          </Routes>
        </main>
      </div>

      <style jsx global>{`
        /* Global responsive styles */
        * {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          main {
            padding: 0.75rem !important;
          }
        }

        @media (max-width: 480px) {
          main {
            padding: 0.5rem !important;
          }
        }

        /* Ensure content doesn't overflow on small screens */
        @media (max-width: 320px) {
          main {
            padding: 0.25rem !important;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;