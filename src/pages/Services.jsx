import Navbar from "../components/Navbar";

function Services() {
  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "30px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "20px",
          }}
        >
          Our Services
        </h1>

        <div style={{ lineHeight: "2" }}>
          <h2 style={{ color: "#2563eb" }}>♻️ Scrap Collection</h2>
          <p>
            Collect and manage different types of scrap materials efficiently in
            one place.
          </p>

          <h2 style={{ color: "#2563eb", marginTop: "25px" }}>
            📦 Scrap Management
          </h2>
          <p>
            Add, update, delete and organize scrap records with complete
            details.
          </p>

          <h2 style={{ color: "#2563eb", marginTop: "25px" }}>
            📊 Dashboard Analytics
          </h2>
          <p>
            View total scraps, available items, sold items, total weight and
            total value through an interactive dashboard.
          </p>

          <h2 style={{ color: "#2563eb", marginTop: "25px" }}>
            📈 Data Visualization
          </h2>
          <p>
            Analyze scrap status using Pie Charts for better decision-making.
          </p>

          <h2 style={{ color: "#2563eb", marginTop: "25px" }}>
            📄 PDF Report
          </h2>
          <p>
            Generate and download professional PDF reports of scrap records with
            a single click.
          </p>

          <h2 style={{ color: "#2563eb", marginTop: "25px" }}>
            🚨 Emergency Support
          </h2>
          <p>
            Quickly access the Emergency Module whenever urgent assistance is
            required.
          </p>
        </div>
      </div>
    </>
  );
}

export default Services;