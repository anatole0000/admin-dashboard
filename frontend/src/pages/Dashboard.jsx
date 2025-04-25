import React from "react";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";  // Importing the correct icons

export default function Dashboard({ user, onLogout }) {
  return (
    <div style={styles.container}>
      <h1>Welcome, {user.username} ({user.role})</h1>
      <div style={styles.icons}>
        <FaUser style={styles.icon} />
        <FaCog style={styles.icon} />
        <FaSignOutAlt style={styles.icon} onClick={onLogout} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",  // Take full width
    maxWidth: "100%",  // Ensure no limit on the width
    margin: "0 auto",  // Center the content horizontally
    textAlign: "center",
  },
  icons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  icon: {
    fontSize: "28px",
    cursor: "pointer",
    color: "#4a90e2",
  }
};
