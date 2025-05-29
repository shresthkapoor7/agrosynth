import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HeatmapPage from "./pages/HeatmapPage";
import UserAlertsPage from "./pages/UserAlertsPage";
import WindyEmbed from "./pages/WindyEmbed";
import AIAlertsPage from "./pages/AIAlertsPage";

function NavigationBar() {
  return (
    <nav style={{
      padding: "1rem",
      backgroundColor: "#f8f9fa",
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      borderBottom: "1px solid #dee2e6"
    }}>
      <Link to="/" style={{
        padding: "0.5rem 1rem",
        textDecoration: "none",
        color: "#495057",
        borderRadius: "4px",
        backgroundColor: "#e9ecef"
      }}>Heatmap</Link>
      <Link to="/user-alerts" style={{
        padding: "0.5rem 1rem",
        textDecoration: "none",
        color: "#495057",
        borderRadius: "4px",
        backgroundColor: "#e9ecef"
      }}>User Alerts</Link>
      <Link to="/windy" style={{
        padding: "0.5rem 1rem",
        textDecoration: "none",
        color: "#495057",
        borderRadius: "4px",
        backgroundColor: "#e9ecef"
      }}>Windy Map</Link>
      <Link to="/ai-alerts" style={{
        padding: "0.5rem 1rem",
        textDecoration: "none",
        color: "#495057",
        borderRadius: "4px",
        backgroundColor: "#e9ecef"
      }}>AI Alerts</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HeatmapPage />} />
          <Route path="/user-alerts" element={<UserAlertsPage />} />
          <Route path="/windy" element={<WindyEmbed />} />
          <Route path="/ai-alerts" element={<AIAlertsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;