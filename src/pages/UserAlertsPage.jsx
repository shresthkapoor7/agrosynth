import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  FaSun, FaCloudRain, FaWind, FaTemperatureHigh, FaWater,
  FaSnowflake, FaBug, FaExclamationTriangle
} from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

// Weather types with icon mapping
const WEATHER_TYPES = {
  sun: { icon: FaSun, color: "#FFD700" },
  rain: { icon: FaCloudRain, color: "#4169E1" },
  wind: { icon: FaWind, color: "#87CEEB" },
  heatwave: { icon: FaTemperatureHigh, color: "#FF4500" },
  flood: { icon: FaWater, color: "#000080" },
  hailstorm: { icon: FaSnowflake, color: "#4682B4" },
  anomaly: { icon: FaExclamationTriangle, color: "#9370DB" },
  pests: { icon: FaBug, color: "#556B2F" },
};

// Create dynamic Leaflet icon from a React icon component
function createWeatherIcon(typeId) {
  const weather = WEATHER_TYPES[typeId];
  if (!weather) return null;

  const html = ReactDOMServer.renderToString(
    <div style={{
      background: "white",
      borderRadius: "50%",
      padding: "6px",
      boxShadow: "0 0 4px rgba(0,0,0,0.3)"
    }}>
      <weather.icon size={24} color={weather.color} />
    </div>
  );

  return L.divIcon({
    html,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

const TemperaturePage = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const apiKey = process.env.REACT_APP_OWM_API_KEY;
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("weather_alerts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAlerts(parsed);
      } catch (e) {
        console.error("Failed to parse alerts from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Fallback to NYC if geolocation fails
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.006 }); // No geolocation support
    }
  }, []);

  return (
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
        {userLocation && (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution="&copy; OpenWeatherMap"
            opacity={0.5}
          />
          <TileLayer
            url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`}
            attribution="&copy; OpenWeatherMap"
            opacity={1}
          />

          {alerts.map((alert, idx) => {
            if (!alert.lat || !alert.lng) return null;
            const icon = createWeatherIcon(alert.weatherType);
            return (
              <Marker
                key={idx}
                position={[alert.lat, alert.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => setSelectedAlert(alert),
                }}
              />
              );
            })}
          </MapContainer>
        )}
      </div>

      {selectedAlert && (
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
            onClick={() => setSelectedAlert(null)}
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

          <h2 style={{ marginTop: "1.5rem" }}>{selectedAlert.name}</h2>
          <p><strong>Description:</strong> {selectedAlert.description}</p>
          <p><strong>Type:</strong> {selectedAlert.weatherType}</p>
          <p><strong>Location:</strong> {selectedAlert.location}</p>
          <p><strong>Time:</strong> {new Date(selectedAlert.createdAt).toLocaleString()}</p>


          {selectedAlert.previewUrl && (
            <img
              src={selectedAlert.previewUrl}
              alt="Alert"
              style={{
                width: "100%",
                borderRadius: "6px",
                marginTop: "1rem",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TemperaturePage;