import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TemperaturePage = () => {
  const apiKey = process.env.REACT_APP_OWM_API_KEY;
  console.log(apiKey);

  return (
    <MapContainer center={[40.7128, -74.006]} zoom={6} style={{ height: "100vh", width: "100%" }}>
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
</MapContainer>
  );
};

export default TemperaturePage;