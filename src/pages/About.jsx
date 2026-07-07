import Navbar from "../components/Navbar";

function About() {
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
          About ScrapX
        </h1>

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.8",
            color: "#444",
          }}
        >
          <strong>ScrapX</strong> is a Smart Scrap Management System developed
          using React and Firebase. It helps users manage scrap items easily,
          keep records organized, and monitor overall scrap statistics through
          an interactive dashboard.
        </p>

        <h2 style={{ color: "#2563eb", marginTop: "30px" }}>
          🎯 Project Objectives
        </h2>

        <ul style={{ lineHeight: "2" }}>
          <li>Manage scrap records digitally.</li>
          <li>Reduce manual paperwork.</li>
          <li>Track scrap weight and value.</li>
          <li>Provide dashboard analytics.</li>
          <li>Generate reports for better management.</li>
        </ul>

        <h2 style={{ color: "#2563eb", marginTop: "30px" }}>
          🚀 Key Features
        </h2>

        <ul style={{ lineHeight: "2" }}>
          <li>User Authentication</li>
          <li>Add, Edit & Delete Scrap</li>
          <li>Search & Filter</li>
          <li>Dashboard Analytics</li>
          <li>Pie Chart Visualization</li>
          <li>PDF Report Export</li>
          <li>Emergency Module</li>
        </ul>

        <h2 style={{ color: "#2563eb", marginTop: "30px" }}>
          💻 Technologies Used
        </h2>

        <ul style={{ lineHeight: "2" }}>
          <li>React.js</li>
          <li>Firebase Authentication</li>
          <li>Cloud Firestore</li>
          <li>Recharts</li>
          <li>jsPDF</li>
          <li>CSS</li>
        </ul>

        <h2 style={{ color: "#2563eb", marginTop: "30px" }}>
          👩‍💻 Developer
        </h2>

        <p style={{ fontSize: "18px" }}>
          <strong>Nandini Jain</strong>
          <br />
          BCA Student
        </p>
      </div>
    </>
  );
}

export default About;