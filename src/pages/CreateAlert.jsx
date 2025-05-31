import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";
import {
    FaSun, FaCloudRain, FaWind, FaImage,
    FaTemperatureHigh, FaWater, FaSnowflake, FaBug, FaExclamationTriangle
} from "react-icons/fa";
import { supabase } from "../supabase";

const WEATHER_TYPES = [
    { id: 'sun', label: 'Sunny', icon: FaSun, color: '#FFD700' },
    { id: 'rain', label: 'Rainy', icon: FaCloudRain, color: '#4169E1' },
    { id: 'wind', label: 'Windy', icon: FaWind, color: '#87CEEB' },
    { id: 'heatwave', label: 'Heatwave', icon: FaTemperatureHigh, color: '#FF4500' },
    { id: 'flood', label: 'Flood', icon: FaWater, color: '#000080' },
    { id: 'hailstorm', label: 'Hailstorm', icon: FaSnowflake, color: '#4682B4' },
    { id: 'anomaly', label: 'Weather Anomaly', icon: FaExclamationTriangle, color: '#9370DB' },
    { id: 'pests', label: 'Pest Swarm', icon: FaBug, color: '#556B2F' }
];

// WeatherAlert class/structure
class WeatherAlert {
    constructor({ name, location, description, weatherType, image, previewUrl, lat, lng }) {
        this.name = name;
        this.location = location;
        this.description = description;
        this.weatherType = weatherType;
        this.image = image;
        this.previewUrl = previewUrl;
        this.lat = lat;
        this.lng = lng;
        this.createdAt = new Date();
    }
}

const TemperaturePage = () => {
    const isInitialLoad = useRef(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        weatherType: '',
        image: null,
        location: '',
        lat: null,
        lng: null
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            const deviceId = localStorage.getItem("device_id");
            const { data, error } = await supabase
                .from("user_alerts")
                .select("*")
                .eq("device_id", deviceId)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching alerts:", error);
            } else {
                const formatted = data.map(alert => ({
                    ...alert,
                    previewUrl: alert.image_url,
                    weatherType: alert.weather_type,
                    createdAt: new Date(alert.created_at),
                }));
                setAlerts(formatted);
            }
        };

        fetchAlerts();
    }, []);

    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }
        localStorage.setItem('weather_alerts', JSON.stringify(alerts));
    }, [alerts]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // fetch place name
                    const placeName = await getPlaceName(lat, lon);

                    setFormData((prev) => ({
                        ...prev,
                        location: placeName,
                        lat: lat,
                        lng: lon
                    }));

                    setUserLocation({ lat, lng: lon });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setUserLocation({ lat: 40.7128, lng: -74.006 }); // fallback
                }
            );
        }
    }, []);

    async function getPlaceName(lat, lon) {
        const response = await fetch(
            `https://corsproxy.io/?https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();
        return data.display_name || `${lat}, ${lon}`;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'location' ? { lat: null, lng: null } : {})
        }));
    };

    const uploadToSupabase = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            throw new Error('Invalid image file');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('alerts') // <- bucket name here
            .upload(fileName, file, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Upload error:", error);
            throw error;
        }

        const { data: publicUrlData } = supabase
            .storage
            .from('alerts')
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const supabaseUrl = await uploadToSupabase(file);
                setPreviewUrl(supabaseUrl);
            } catch (err) {
                alert("Failed to upload image");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const deviceId = localStorage.getItem("device_id");

        const newAlert = new WeatherAlert({
            name: formData.name,
            location: formData.location,
            description: formData.description,
            weatherType: formData.weatherType,
            previewUrl: previewUrl,
            lat: formData.lat,
            lng: formData.lng
        });

        setAlerts((prev) => [newAlert, ...prev]);

        const { error } = await supabase.from("user_alerts").insert({
            name: newAlert.name,
            location: newAlert.location,
            description: newAlert.description,
            weather_type: newAlert.weatherType,
            image_url: newAlert.previewUrl,
            lat: newAlert.lat,
            lng: newAlert.lng,
            created_at: newAlert.createdAt.toISOString(),
            device_id: deviceId
        });

        if (error) {
            console.error("Error inserting alert:", error);
        }

        setFormData({
            name: '',
            description: '',
            weatherType: '',
            image: null,
            location: '',
            lat: null,
            lng: null
        });
        setPreviewUrl(null);
    };

    const handleMapClick = (latlng) => {
        getPlaceName(latlng.lat, latlng.lng).then((placeName) => {
            setFormData((prev) => ({
                ...prev,
                location: placeName,
                lat: latlng.lat,
                lng: latlng.lng,
            }));
        });
        setSelectedPosition(latlng);
        setShowMap(false);
    };

    function LocationPickerMap() {
        useMapEvents({
            click(e) {
                handleMapClick(e.latlng);
            },
        });
        return selectedPosition ? <Marker position={selectedPosition} /> : null;
    }

    return (
        <div style={{
            minHeight: "100vh",
            padding: "2vw 2vw 4vw 2vw",
            backgroundColor: "#f8f9fa",
            fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
            <div style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "2rem 1.5rem",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                width: "100%"
            }}>
                <h1 style={{ fontSize: "2rem", color: "#1a1a1a", marginBottom: "2rem", textAlign: "center" }}>
                    Report a Weather Alert
                </h1>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>
                    {/* Alert Name */}
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#495057" }}>
                            Alert Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: "100%", padding: "0.75rem", borderRadius: "6px",
                                border: "1px solid #dee2e6", fontSize: "1rem"
                            }}
                            placeholder="Enter alert name"
                        />
                    </div>

                    {/* Location Field */}
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                            <label style={{ marginBottom: "0.5rem", color: "#495057" }}>
                                Location (latitude, longitude)
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: "100%", padding: "0.75rem", borderRadius: "6px",
                                    border: "1px solid #dee2e6", fontSize: "1rem"
                                }}
                                placeholder="Enter location or use default"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedPosition(null);     // reset previously picked marker
                                setShowMap(true);              // open map popup
                            }}
                            style={{
                                padding: "0.75rem 1.2rem", backgroundColor: "#2196F3",
                                color: "white", border: "none", borderRadius: "6px",
                                fontWeight: 600, cursor: "pointer", height: "42px",
                                minWidth: "120px"
                            }}
                        >
                            Pick Location
                        </button>
                    </div>

                    {/* Map Modal */}
                    {showMap && (
                        <div style={{
                            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                            background: "rgba(0,0,0,0.4)", zIndex: 2001,
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <div style={{
                                background: "white", borderRadius: "12px", padding: "1rem",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.2)", minWidth: 250,
                                minHeight: 250, position: "relative", width: "90vw", maxWidth: 420
                            }}>
                                <button
                                    onClick={() => setShowMap(false)}
                                    style={{
                                        position: "absolute", top: 10, right: 10, background: "#eee",
                                        border: "none", borderRadius: "50%", width: 32, height: 32,
                                        fontWeight: 700, cursor: "pointer"
                                    }}
                                >
                                    ×
                                </button>
                                <MapContainer
                                    center={selectedPosition || userLocation || { lat: 40.7128, lng: -74.006 }}
                                    zoom={13}
                                    style={{ width: "100%", height: "55vw", maxWidth: 400, maxHeight: 400, minHeight: 200 }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="&copy; OpenStreetMap contributors"
                                    />
                                    <LocationPickerMap />
                                </MapContainer>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#495057" }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: "100%", padding: "0.75rem", borderRadius: "6px",
                                border: "1px solid #dee2e6", fontSize: "1rem",
                                minHeight: "100px", resize: "vertical"
                            }}
                            placeholder="Enter alert description"
                        />
                    </div>

                    {/* Weather Type */}
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#495057" }}>
                            Weather Type
                        </label>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: "1rem",
                            maxHeight: "300px",
                            overflowY: "auto",
                            paddingRight: "0.5rem"
                        }}>
                            {WEATHER_TYPES.map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, weatherType: type.id }))}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "6px",
                                        border: "2px solid",
                                        borderColor: formData.weatherType === type.id ? type.color : "#dee2e6",
                                        backgroundColor: formData.weatherType === type.id ? `${type.color}20` : "white",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        width: "100%",
                                        justifyContent: "center"
                                    }}
                                >
                                    <type.icon size={20} color={type.color} />
                                    <span style={{ color: "#495057" }}>{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", color: "#495057" }}>
                            Alert Image
                        </label>
                        <div style={{
                            border: "2px dashed #dee2e6",
                            borderRadius: "6px",
                            padding: "2rem",
                            textAlign: "center",
                            cursor: "pointer",
                            position: "relative"
                        }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    top: 0,
                                    left: 0,
                                    opacity: 0,
                                    cursor: "pointer"
                                }}
                            />
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        borderRadius: "6px",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                <div style={{ color: "#6c757d" }}>
                                    <FaImage size={40} style={{ marginBottom: "1rem" }} />
                                    <p>Click to upload an image</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        style={{
                            padding: "1rem",
                            backgroundColor: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        Report Alert
                    </button>
                </form>

                {alerts.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                        <h2 style={{ textAlign: 'center', color: '#1a1a1a' }}>Reported Alerts By Current Device</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {alerts.map((alert, idx) => (
                                <li key={idx} style={{
                                    margin: '1rem 0',
                                    padding: '1rem',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '8px',
                                    background: '#f9f9f9',
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    flexWrap: 'wrap'
                                }}>
                                    <img
                                        src={alert.previewUrl}
                                        alt="Alert"
                                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', wordBreak: 'break-word' }}>{alert.name}</div>
                                        <div style={{ color: '#666', fontSize: '0.95rem', margin: '0.2rem 0', wordBreak: 'break-word' }}>{alert.description}</div>
                                        <div style={{ color: '#888', fontSize: '0.9rem', wordBreak: 'break-word' }}>Location: {alert.location}</div>
                                        <div style={{ color: '#888', fontSize: '0.9rem' }}>Created: {alert.createdAt.toLocaleString()}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
                                        {(() => {
                                            const type = WEATHER_TYPES.find(t => t.id === alert.weatherType);
                                            return type ? <type.icon size={32} color={type.color} title={type.label} /> : null;
                                        })()}
                                        <span style={{ fontSize: '0.9rem', color: '#555', marginTop: 4 }}>
                                            {(() => {
                                                const type = WEATHER_TYPES.find(t => t.id === alert.weatherType);
                                                return type ? type.label : '';
                                            })()}
                                        </span>
                                        <button
                                            onClick={async () => {
                                                const confirmed = window.confirm("Are you sure you want to delete this alert?");
                                                if (!confirmed) return;

                                                const { error } = await supabase
                                                    .from("user_alerts")
                                                    .delete()
                                                    .eq("id", alert.id)
                                                    .eq("device_id", localStorage.getItem("device_id")); // protection

                                                if (error) {
                                                    console.error("Failed to delete alert:", error);
                                                    alert("Failed to delete alert.");
                                                } else {
                                                    setAlerts(prev => prev.filter(a => a.id !== alert.id));
                                                }
                                            }}
                                            style={{
                                                marginTop: "0.5rem",
                                                backgroundColor: "#ff4d4d",
                                                color: "white",
                                                padding: "0.3rem 0.7rem",
                                                border: "none",
                                                borderRadius: "4px",
                                                fontSize: "0.8rem",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <style>{`
                @media (max-width: 600px) {
                    .leaflet-container {
                        height: 50vw !important;
                        min-height: 180px !important;
                        max-height: 250px !important;
                    }
                    form > div, form > button {
                        font-size: 0.97rem !important;
                    }
                    h1 {
                        font-size: 1.3rem !important;
                    }
                }
                @media (max-width: 480px) {
                    .leaflet-container {
                        height: 45vw !important;
                        min-height: 120px !important;
                        max-height: 180px !important;
                    }
                    .alert-list-item {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                    }
                }
                @media (max-width: 400px) {
                    .leaflet-container {
                        height: 40vw !important;
                        min-height: 80px !important;
                        max-height: 120px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default TemperaturePage;