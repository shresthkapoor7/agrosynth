import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Heatmap points [lat, lng, intensity]
const points = [
    [40.7128, -74.0060, 1.0], // Manhattan
    [40.7306, -73.9352, 1.0], // Queens
    [40.6500, -73.9499, 1.0], // Brooklyn
    [40.8448, -73.8648, 1.0], // Bronx
    [40.5795, -74.1502, 1.0], // Staten Island
    [40.6782, -73.9442, 0.9], // Crown Heights
    [40.7484, -73.9857, 0.8], // Midtown
    [40.7580, -73.9855, 0.7], // Times Square
    [40.7291, -73.9965, 0.7], // NYU
  ];

function HeatmapLayer() {
  const map = useMap();

  useEffect(() => {
    // Dynamically import leaflet.heat
    import("leaflet.heat").then(() => {
      const heatLayer = L.heatLayer(points, {
        radius: 50,
        blur: 25,
        zoom: 12,
        maxZoom: 17,
        gradient: {
          0.2: "blue",
          0.4: "lime",
          0.6: "orange",
          0.8: "red",
        },
      }).addTo(map);

      return () => {
        map.removeLayer(heatLayer);
      };
    });
  }, [map]);

  return null;
}

export default function HeatmapPage() {
  return (
    <MapContainer
      center={[40.7128, -74.0060]} // NYC
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <HeatmapLayer />
    </MapContainer>
  );
}