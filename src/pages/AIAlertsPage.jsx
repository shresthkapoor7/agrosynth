import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

const manhattanCoords = [
  [40.700292, -74.018489],
  [40.706877, -73.996207],
  [40.715337, -73.974815],
  [40.729646, -73.971462],
  [40.739856, -73.958918],
  [40.752259, -73.949661],
  [40.773116, -73.949018],
  [40.789695, -73.942837],
  [40.796388, -73.935356],
  [40.805478, -73.925056],
  [40.810841, -73.929677],
  [40.809742, -73.934384],
  [40.801694, -73.943562],
  [40.790904, -73.949542],
  [40.778356, -73.962788],
  [40.769115, -73.971933],
  [40.751025, -73.976353],
  [40.73808, -73.982932],
  [40.723385, -73.992989],
  [40.708472, -74.010673],
];

const redHookCoords = [
  [40.6762, -74.0189],
  [40.6755, -74.0126],
  [40.6732, -74.0093],
  [40.6705, -74.0059],
  [40.6710, -74.0023],
  [40.6747, -74.0008],
  [40.6771, -74.0021],
  [40.6784, -74.0069],
  [40.6800, -74.0094],
  [40.6810, -74.0151],
  [40.6802, -74.0183],
  [40.6782, -74.0201],
  [40.6762, -74.0189]
];

export default function ManhattanPolygonMap() {
  const [regionInfo, setRegionInfo] = useState(null);

  return (
    <div>
      <center style={{ color: "red" }}><h4>This feature is not available yet, currently only showing dummy data</h4></center>
      <div
        style={{
          height: "85vh",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          margin: "2rem auto",
          maxWidth: "1200px",
        }}
      >
        <div style={{ flex: 1 }}>
          <MapContainer
            center={[40.6765, -74.0105]}  // Approx center of Red Hook
            zoom={15}                     // More zoomed in
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Polygon
              positions={redHookCoords}
              pathOptions={{ color: "red", weight: 2, fillOpacity: 0.3 }}
              eventHandlers={{
                click: () =>
                  setRegionInfo({
                    name: "Red Hook, Brooklyn",
                    population: "1.6 million",
                    hazard: "📊 AI Prediction: 78% chance of heavy rainfall in the next 5 days based on rainfall forecast and drainage capacity.",
                    resources: [
                      "🛌 34 active shelters (86% capacity)",
                      "🚑 12 medical units deployed",
                      "🚒 9 fire stations on standby"
                    ],
                    updatedAt: new Date().toLocaleString(),
                  }),
              }}
            />
          </MapContainer>
        </div>

        {regionInfo && (
          <div
            style={{
              width: "320px",
              height: "100%",
              backgroundColor: "white",
              borderLeft: "1px solid #ccc",
              padding: "1rem",
              overflowY: "auto",
              position: "relative",
              zIndex: 1000,
            }}
          >
            <button
              onClick={() => setRegionInfo(null)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#f0f0f0",
                border: "none",
                borderRadius: "4px",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              ×
            </button>

            <h2 style={{ marginTop: "1.5rem" }}>{regionInfo.name}</h2>
            <p><strong>Population:</strong> {regionInfo.population}</p>
            <p><strong>Hazard Info:</strong> {regionInfo.hazard}</p>
            <p></p>
            <p><strong>Resources:</strong></p>
            <ul>
              {regionInfo.resources.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <div style={{
              marginTop: "1.5rem",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeeba",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
            }}>
              <p style={{ fontWeight: "bold", marginBottom: "0.25rem", color: "#856404" }}>
                ⚠️ Pest Alert
              </p>
              <p style={{ margin: 0, color: "#856404" }}>
                Infestation Risk: AI model forecasts an outbreak of <strong>Brassica Pests</strong> (e.g. Cabbage Worm) in the next 7 days due to recent humidity spikes. Affects crops like <strong>Cabbage</strong>, <strong>Kale</strong>, and <strong>Lettuce</strong>.
              </p>
            </div>

            <p style={{ marginTop: "1rem" }}>
              <strong>Last Updated:</strong> {regionInfo.updatedAt}
            </p>
          </div>
        )}
      </div>
    </div>

  );
}