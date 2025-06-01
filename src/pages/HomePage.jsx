import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaReact, FaGithub } from "react-icons/fa";
import { SiSupabase, SiReactrouter, SiLeaflet } from "react-icons/si";
import { supabase } from '../supabase';
export default function HomePage() {
    const [alerts, setAlerts] = useState([]);
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        let deviceId = localStorage.getItem("device_id");
        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem("device_id", deviceId);
        }
    }, []);

    useEffect(() => {
        const fetchAlerts = async () => {
            const { data, error } = await supabase
                .from("user_alerts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching alerts:", error);
            } else {
                const formatted = data.map(alert => ({
                    ...alert,
                    previewUrl: alert.image_url,
                    weatherType: alert.weather_type,
                    createdAt: alert.created_at,
                }));
                setAlerts(formatted);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <div style={{
            minHeight: "100vh",
            padding: "1rem 0.75rem",
            backgroundColor: "#f8f9fa",
            fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "2rem",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    color: "#1a1a1a",
                    marginBottom: "2rem",
                    textAlign: "center"
                }}>
                    AgroSynth Weather Intelligence
                </h1>
                <center><p style={{ fontSize: "1.2rem", color: "#666" }}>Made for Reboot the Earth Hackathon by</p></center>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "1rem",
                    marginBottom: "2rem"
                }}>
                    {[
                        { name: "Shresth", url: "https://github.com/ShresthKapoor7" },
                        { name: "Aditya", url: "https://www.linkedin.com/in/aditya-maheshwari-56b544251/" },
                        { name: "Hannah", url: "https://www.linkedin.com/in/hannah-hb1225/" },
                        { name: "Tram", url: "https://www.linkedin.com/in/ngoctramnguyen22/" },
                        { name: "Tanishq", url: "https://www.linkedin.com/in/tanishq-sharma-ts/" },
                    ].map((person, i) => (
                        <a
                            key={i}
                            href={person.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#0077b6",
                                fontWeight: 500,
                                textDecoration: "none",
                                border: "1px solid #0077b6",
                                padding: "0.4rem 0.9rem",
                                borderRadius: "6px",
                                transition: "all 0.2s ease-in-out"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#0077b6";
                                e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#0077b6";
                            }}
                        >
                            {person.name}
                        </a>
                    ))}
                </div>
                <iframe
                    width="100%"
                    height="500"
                    src="https://www.youtube.com/embed/clavoPIzdBc"
                    title="Demo video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
                ></iframe>

                {alerts.length > 0 && (
                    <div style={{
                        backgroundColor: "#fff8e1",
                        border: "1px solid #ffecb3",
                        padding: "1rem 1.25rem",
                        marginBottom: "2rem",
                        borderRadius: "8px"
                    }}>
                        <h3 style={{ margin: 0, color: "#444" }}>🚨 Recent User Alerts</h3>
                        <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.2rem" }}>
                            {alerts.map((alert, i) => (
                                <li key={i} style={{ marginBottom: "0.25rem" }}>
                                    <strong>{alert.weatherType.toUpperCase()}</strong> in <em>{alert.location}</em> — {alert.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem",
                    marginTop: "3rem"
                }}>
                    <FeatureCard
                        title="User Alerts"
                        description="Create and manage custom weather alerts for your specific locations. Set up notifications for conditions that matter to you."
                        link="/user-alerts"
                        color="#4CAF50"
                    />

                    <FeatureCard
                        title="Windy Weather Map"
                        description="Access detailed weather information through our interactive Windy map integration. View real-time weather patterns, forecasts, and environmental data."
                        link="/windy"
                        color="#2196F3"
                    />

                    <FeatureCard
                        title="AI Weather Predictions"
                        description="Leverage our advanced LLM to get intelligent weather predictions and insights. Our AI analyzes patterns to provide accurate future weather forecasts."
                        link="/ai-alerts"
                        color="#9C27B0"
                    />
                </div>

                <div style={{
                    marginTop: "3rem",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "0.9rem"
                }}>
                    <div style={{
                        marginTop: "3rem",
                        textAlign: "center",
                        color: "#666",
                        fontSize: "0.9rem"
                    }}>
                        <div style={{
                            backgroundColor: "#e9f5ff",
                            border: "1px solid #b3e0ff",
                            padding: "1.25rem 1.5rem",
                            borderRadius: "8px",
                            marginBottom: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            {!subscribed ? (
                                <>
                                    <h3 style={{
                                        margin: 0,
                                        marginBottom: "0.5rem",
                                        fontSize: "1.25rem",
                                        color: "#0077b6"
                                    }}>
                                        📬 Subscribe to alerts in your area
                                    </h3>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            padding: "0.75rem 1rem",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                            width: "100%",
                                            maxWidth: "400px",
                                            fontSize: "1rem",
                                            marginBottom: "1rem"
                                        }}
                                    />
                                    <button
                                        onClick={() => setSubscribed(true)}
                                        style={{
                                            padding: "0.5rem 1.2rem",
                                            backgroundColor: "#0077b6",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "600"
                                        }}
                                    >
                                        Subscribe
                                    </button>
                                </>
                            ) : (
                                <p style={{ fontSize: "1.1rem", fontWeight: "500", color: "#0077b6" }}>
                                    ✅ Subscribed (it was made for hackathon so it's not working)
                                </p>
                            )}
                        </div>
                    </div>
                    <p>Built for Reboot the Earth Hackathon</p>
                    <p>Empowering users with intelligent weather insights</p>
                    <div style={{
                        marginTop: "1rem",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1.5rem",
                        fontSize: "1rem",
                        color: "#444"
                    }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <FaReact color="#61DBFB" size={20} /> React
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <SiSupabase color="#3ECF8E" size={20} /> Supabase
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                stroke="currentColor"
                            >
                                <g clipPath="url(#clip0_205_3)">
                                    <path
                                        d="M3 248.945C18 248.945 76 236 106 219C136 202 136 202 198 158C276.497 102.293 332 120.945 423 120.945"
                                        strokeWidth="90"
                                    />
                                    <path d="M511 121.5L357.25 210.268L357.25 32.7324L511 121.5Z" />
                                    <path
                                        d="M0 249C15 249 73 261.945 103 278.945C133 295.945 133 295.945 195 339.945C273.497 395.652 329 377 420 377"
                                        strokeWidth="90"
                                    />
                                    <path d="M508 376.445L354.25 287.678L354.25 465.213L508 376.445Z" />
                                </g>
                            </svg>
                            OpenRouter
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <SiLeaflet color="#199900" size={20} /> React Leaflet
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <FaGithub size={20} /> GitHub
                        </span>
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "2rem",
                        marginBottom: "2rem"
                    }}>
                        <a
                            href="https://github.com/shresthkapoor7/agrosynth" // replace with your repo URL
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#0077b6",
                                fontWeight: 500,
                                textDecoration: "none",
                                border: "1px solid #0077b6",
                                padding: "0.5rem 1.2rem",
                                borderRadius: "6px",
                                transition: "all 0.2s ease-in-out"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#0077b6";
                                e.currentTarget.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#0077b6";
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <FaGithub size={20} /> View on GitHub
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    );
}


function FeatureCard({ title, description, link, color }) {
    return (
        <div
            style={{
                padding: "2rem",
                borderRadius: "8px",
                backgroundColor: "white",
                border: `2px solid ${color}`,
                transition: "transform 0.2s",
                cursor: "pointer",
                maxWidth: "100%",
                boxSizing: "border-box",
                margin: "0 auto",
                wordWrap: "break-word",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <h2
                style={{
                    color: color,
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                }}
            >
                {title}
            </h2>
            <p
                style={{
                    color: "#666",
                    marginBottom: "1.5rem",
                    lineHeight: "1.6",
                }}
            >
                {description}
            </p>
            <Link
                to={link}
                style={{
                    display: "inline-block",
                    padding: "0.8rem 1.5rem",
                    backgroundColor: color,
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontWeight: "500",
                    transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = 0.9;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = 1;
                }}
            >
                Explore
            </Link>
        </div>
    );
}