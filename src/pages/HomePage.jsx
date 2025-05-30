import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const [alerts, setAlerts] = useState([]);
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("weather_alerts");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setAlerts(parsed.slice(0, 5)); // show up to 5 recent alerts
            } catch (e) {
                console.error("Failed to parse alerts:", e);
            }
        }
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
                    backgroundColor: "#e3f2fd",
                    border: "1px solid #90caf9",
                    padding: "1rem 1.25rem",
                    marginBottom: "2rem",
                    borderRadius: "8px"
                }}>
                    <h3 style={{ margin: 0, color: "#0d47a1" }}>🤖 AI-Powered Forecasts</h3>
                    <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.2rem" }}>
                        <li style={{ marginBottom: "0.25rem" }}>
                            <strong>Urban Flood Risk in Red Hook</strong> — 78% chance of flooding in the next 5 days based on rainfall and drainage patterns.
                        </li>
                        <li style={{ marginBottom: "0.25rem" }}>
                            <strong>Brassica Pest Surge Likely</strong> — Cabbage worm activity expected due to high humidity; risk to Cabbage, Kale, and Lettuce crops.
                        </li>
                    </ul>
                </div>

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
                                    ✅ Subscribed
                                </p>
                            )}
                        </div>
                    </div>
                    <p>Built for the Open Source Hackathon</p>
                    <p>Empowering users with intelligent weather insights</p>
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