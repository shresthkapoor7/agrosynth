export default function WindyEmbed() {
    return (
      <div
        style={{
          height: "85vh",
          width: "100%",
          overflow: "hidden",
          margin: "2rem auto",
          maxWidth: "1200px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          title="Windy NYC Marker"
          src="https://embed.windy.com/embed2.html?lat=40.7128&lon=-74.0060&detailLat=40.7128&detailLon=-74.0060&width=650&height=450&zoom=11&level=surface&overlay=wind&menu=&message=true&marker=40.7128,-74.0060&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
          }}
        />
      </div>
    );
  }