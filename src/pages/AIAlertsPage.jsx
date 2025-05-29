import { MapContainer, TileLayer, Polygon } from "react-leaflet";
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
  [40.738080, -73.982932],
  [40.723385, -73.992989],
  [40.708472, -74.010673],
];

export default function ManhattanPolygonMap() {
  return (
    <MapContainer
      center={[40.78, -73.97]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Polygon
        positions={manhattanCoords}
        pathOptions={{ color: "red", weight: 2, fillOpacity: 0.3 }}
      />
    </MapContainer>
  );
}